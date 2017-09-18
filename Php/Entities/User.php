<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Authorization\TwoFactorAuth;
use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Apps\Webiny\Php\Lib\Interfaces\UserInterface;
use Apps\Webiny\Php\Lib\Entity\Attributes\FileAttribute;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\RequestHandlers\ApiException;
use Webiny\Component\Crypt\CryptTrait;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\Mailer\Email;
use Webiny\Component\Mailer\MailerTrait;
use Webiny\Component\Mongo\Index\CompoundIndex;

/**
 * Class User
 *
 * @property string           $id
 * @property string           $email
 * @property string           $password
 * @property string           $firstName
 * @property string           $lastName
 * @property string           $lastActive
 * @property string           $lastLogin
 * @property string           $passwordRecoveryCode
 * @property EntityCollection $roles
 * @property EntityCollection $roleGroups
 * @property bool             $enabled
 * @property array            $meta
 */
class User extends AbstractEntity implements UserInterface
{
    use CryptTrait, MailerTrait;

    protected static $classId = 'Webiny.Entities.User';
    protected static $entityCollection = 'Users';
    protected static $entityMask = '{email}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('email')->char()->setValidators('required,email,unique')->onSet(function ($email) {
            return trim(strtolower($email));
        })->setValidationMessages([
            'unique' => 'Given e-mail address already exists.'
        ])->setToArrayDefault();

        $this->attr('avatar')->smart(new FileAttribute())->setTags('user', 'avatar')->setOnDelete('cascade');
        $this->attr('gravatar')->dynamic(function () {
            return md5($this->email);
        })->setToArrayDefault();
        $this->attr('firstName')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('lastName')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('password')->char()->onSet(function ($password) {
            if (!empty($password) && $this->wValidation()->validate($password, 'password')) {
                return $this->wAuth()->createPasswordHash($password);
            }

            return $this->password;
        });
        $this->attr('passwordRecoveryCode')->char();
        $this->attr('enabled')->boolean()->setDefaultValue(true);
        $this->attr('roles')->many2many('User2UserRole')->setEntity(UserRole::class)->onSet(function ($roles) {
            // If not mongo Ids - load roles by slugs
            if (is_array($roles)) {
                foreach ($roles as $i => $role) {
                    if (!$this->wDatabase()->isId($role)) {
                        if (is_string($role)) {
                            $roles[$i] = UserRole::findOne(['slug' => $role]);
                        } elseif (isset($role['id'])) {
                            $roles[$i] = $role['id'];
                        } elseif (isset($role['slug'])) {
                            $roles[$i] = UserRole::findOne(['slug' => $role['slug']]);
                        }
                    }
                }
            }

            return $roles;
        });
        $this->attr('roleGroups')->many2many('User2UserRoleGroup')->setEntity(UserRoleGroup::class)->onSet(function ($roleGroups) {
            // If not mongo Ids - load roles by slugs
            if (is_array($roleGroups)) {
                foreach ($roleGroups as $i => $rg) {
                    if (!$this->wDatabase()->isId($rg)) {
                        if (is_string($rg)) {
                            $roleGroups[$i] = UserRoleGroup::findOne(['slug' => $rg]);
                        } elseif (isset($rg['id'])) {
                            $roleGroups[$i] = $rg['id'];
                        } elseif (isset($rg['slug'])) {
                            $roleGroups[$i] = UserRoleGroup::findOne(['slug' => $rg['slug']]);
                        }
                    }
                }
            }

            return $roleGroups;
        });
        $this->attr('lastActive')->datetime();
        $this->attr('lastLogin')->datetime();
        $this->attr('meta')->object();

        // 2 factor auth
        $defaultValue = [
            'status'        => false,
            'secret'        => '',
            'recoveryCodes' => []
        ];

        $this->attr('twoFactorAuth')->object()->setDefaultValue($defaultValue)->onSet(function ($value) {
            return [
                'status'        => $value['status'] ?? $this->twoFactorAuth['status'],
                'secret'        => $value['secret'] ?? $this->twoFactorAuth['secret'],
                'recoveryCodes' => $value['recoveryCodes'] ?? $this->twoFactorAuth['recoveryCodes']
            ];
        });
    }

    protected static function entityIndexes(IndexContainer $indexes)
    {
        parent::entityIndexes($indexes);

        $indexes->add(new CompoundIndex('email', ['email', 'deletedOn'], false, true));
    }


    protected function entityApi(ApiContainer $api)
    {
        parent::entityApi($api);

        /**
         * @api.name        User login
         * @api.description Logs in user with his username and password.
         * @api.body.username   string  Username
         * @api.body.password   string  Password
         * @api.body.rememberme boolean Remember Me
         */
        $api->post('login', function () {
            $data = $this->wRequest()->getRequestData();

            // check if login request
            if (isset($data['username']) && isset($data['password'])) { // username + password form submit
                $login = $this->wAuth()->processLogin($data['username']);

                /* @var User $user */
                $user = $this->wAuth()->getUser();

                if (!$user->enabled) {
                    throw new AppException('User account is disabled!');
                }

                // if 2 auth is turned on, we return the verification token instead of auth token
                if ($login['authToken'] && $user->twoFactorAuth['status']) {
                    $tfa = new TwoFactorAuth($user);

                    // instead of returning the authToken, we return twoFactorAuth:true and the verificationToken
                    return [
                        'twoFactorAuth'     => true,
                        'verificationToken' => $tfa->getVerificationToken($login['authToken'])
                    ];
                }

                // standard login
                return [
                    'authToken' => $login['authToken'],
                    'user'      => $user->toArray($this->wRequest()->getFields('*,!password'))
                ];

            } elseif (isset($data['verificationToken']) && isset($data['twoFactorAuthCode'])) { // two factor auth form submit
                // load user via username
                $user = self::findOne(['email' => $data['username']]);
                if (!$user) {
                    throw new AppException('Verification code is incorrect.');
                }

                // get auth token for the given verification token
                $tfa = new TwoFactorAuth($user);
                $authToken = $tfa->getAuthToken($data['verificationToken']);
                if (!$authToken) {
                    throw new AppException('Verification code is incorrect.');
                }

                // validate the 2 factor auth code
                $result = $tfa->verifyCode($data['twoFactorAuthCode']);
                if (!$result) {
                    throw new AppException('Verification code is incorrect.');
                }

                // if everything is valid, we return the auth token and the user data
                return [
                    'authToken' => $authToken,
                    'user'      => $user->toArray($this->wRequest()->getFields('*,!password'))
                ];
            } else {
                throw new AppException('Unable to process login request. Data is not correctly formatted.');
            }

        });

        /**
         * @api.name        My profile
         * @api.description Returns currently logged in user's data.
         * @api.headers.X-Webiny-Authorization  string  Authorization token
         */
        $api->get('me', function () {
            $user = $this->wAuth()->getUser();
            if (!$user) {
                throw new ApiException('Invalid token', 'WBY-INVALID-TOKEN');
            }

            return $user->toArray($this->wRequest()->getFields('*,!password'));
        });

        /**
         * @api.name        Update my profile
         * @api.description Updates currently logged in user's profile.
         * @api.headers.X-Webiny-Authorization  string  Authorization token
         */
        $api->patch('me', function () {
            $data = $this->wRequest()->getRequestData();
            $user = $this->wAuth()->getUser();

            $user->populate($data)->save();

            if (!$user) {
                throw new ApiException('Invalid token', 'WBY-INVALID-TOKEN');
            }

            return $user->toArray($this->wRequest()->getFields('*,!password'));
        });

        /**
         * @api.name        Reset password
         * @api.description Starts password reset process - sends a password reset code to the received e-mail address.
         * @api.body.email  string  User's email address
         */
        $api->post('reset-password', function () {
            $data = $this->wRequest()->getRequestData();
            $user = self::findOne(['email' => $data['email']]);
            if (!$user) {
                throw new AppException('We could not find a user using this e-mail address!');
            }

            $user->passwordRecoveryCode = $this->crypt()->generateRandomString(6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
            $user->save();

            $mailer = $this->mailer();
            $message = $mailer->getMessage();

            $html = $this->wTemplateEngine()->fetch('Webiny:Templates/Emails/ResetPassword.tpl', ['code' => $user->passwordRecoveryCode]);
            $message->setBody($html);
            $message->setSubject('Your password reset code!');
            $message->setTo(new Email($user->email));

            if ($mailer->send($message)) {
                return true;
            }

            throw new AppException('Failed to send password recovery code!');
        })->setBodyValidators(['email' => 'email']);

        /**
         * @api.name        Set new password
         * @api.description Proceeds with password reset process by receiving a valid reset code. If valid, new password will be set.
         * @api.body.code       string  Password reset code (received via email)
         * @api.body.password   string  New password to set
         */
        $api->post('/set-password', function () {
            $data = $this->wRequest()->getRequestData();

            $user = self::findOne(['passwordRecoveryCode' => $data['code']]);
            if (!$user) {
                throw new AppException('Invalid password reset code!');
            }

            $user->passwordRecoveryCode = '';
            $user->password = $data['password'];
            $user->save();

            return true;
        })->setBodyValidators(['code' => 'required', 'password' => 'required']);

        /**
         * @api.name        Get the user 2 factor auth QR code
         * @api.description Returns the data/base64  qr code for the authenticator application.
         */
        $api->get('/2factor-qr', function () {
            /* @var $user User */
            $user = $this->wAuth()->getUser();
            $tfa = new TwoFactorAuth($user);

            return [
                'qrCode' => $tfa->getQrCode()
            ];
        });

        /**
         * @api.name        Verifies if the given verification code is valid.
         * @api.description Processes the given verification code with the authenticator app and returns the result if the code is valid.
         * @api.body.verification       string  Password reset code (received via email)
         */
        $api->post('/2factor-verify', function () {
            $data = $this->wRequest()->getRequestData();
            /* @var $user User */
            $user = $this->wAuth()->getUser();
            $tfa = new TwoFactorAuth($user);

            $result = $tfa->verifyCode($data['verification']);

            if ($result) {
                $tfa->populateRecoveryCodes();
            }

            return [
                'result' => $result
            ];
        })->setBodyValidators(['verification' => 'required']);

        /**
         * @api.name        Get the user 2 factor auth QR code
         * @api.description Returns the data/base64  qr code for the authenticator application.
         */
        $api->get('/2factor-recovery-codes', function () {
            /* @var $user User */
            $user = $this->wAuth()->getUser();
            $tfa = new TwoFactorAuth($user);

            return [
                'recoveryCodes' => implode("\n", $tfa->getRecoveryCodes())
            ];
        });
    }


    public function save()
    {
        $new = !$this->exists();
        $res = parent::save();
        if ($new) {
            $this->wAuth()->getLogin()->setUserAccountConfirmationStatus($this->email);
        }

        return $res;
    }

    /**
     * @inheritdoc
     */
    public function getUserRoles()
    {
        $roles = $this->roles->getIterator();
        /* @var $group UserRoleGroup */
        foreach ($this->roleGroups as $group) {
            foreach ($group->roles as $r) {
                $roles[] = $r;
            }
        }

        return $roles;
    }

    /**
     * @inheritdoc
     */
    public function hasRole($name)
    {
        foreach ($this->getUserRoles() as $role) {
            if ($role->slug == $name) {
                return true;
            }
        }

        return false;
    }

    public function hasPermission($class, $permission)
    {
        foreach ($this->getUserRoles() as $role) {
            if ($role->checkPermission($class, $permission)) {
                return true;
            }

            // Check if given permission pattern is a crud pattern
            if (isset($this->patterns[$permission]) && $role->checkPermission($class, $this->patterns[$permission])) {
                return true;
            }
        }

        return false;
    }


    /**
     * Triggered when User is logged-in successfully
     *
     * @param $callback
     */
    public static function onLoginSuccess($callback)
    {
        static::on('onLoginSuccess', $callback);
    }

    /**
     * Triggered when User is successfully authenticated (using Authorization)
     *
     * @param $callback
     */
    public static function onActivity($callback)
    {
        static::on('onActivity', $callback);
    }
}