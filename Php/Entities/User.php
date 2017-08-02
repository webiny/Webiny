<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\DevTools\Interfaces\UserInterface;
use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\DevTools\Entity\Attributes\FileAttribute;
use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;
use Apps\Webiny\Php\DevTools\Exceptions\AppException;
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
 * @property bool             $enabled
 *
 * @package Apps\Webiny\Php\Entities
 *
 */
class User extends AbstractEntity implements UserInterface
{
    use WebinyTrait, CryptTrait, MailerTrait;

    protected static $entityCollection = 'Users';
    protected static $entityMask = '{email}';

    public function __construct()
    {
        parent::__construct();

        $this->index(new CompoundIndex('email', ['email', 'deletedOn'], false, true));

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
        $userRole = '\Apps\Webiny\Php\Entities\UserRole';
        $this->attr('roles')->many2many('User2UserRole')->setEntity($userRole)->onSet(function ($roles) {
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
        $this->attr('lastActive')->datetime();
        $this->attr('lastLogin')->datetime();

        /**
         * @api.name        User login
         * @api.description Logs in user with his username and password.
         * @api.body.username   string  Username
         * @api.body.password   string  Password
         * @api.body.rememberme boolean Remember Me
         */
        $this->api('POST', 'login', function () {
            $data = $this->wRequest()->getRequestData();
            $login = $this->wAuth()->processLogin($data['username']);

            /* @var User $user */
            $user = $this->wAuth()->getUser();

            if (!$user->enabled) {
                throw new AppException('User account is disabled!');
            }

            return [
                'authToken' => $login['authToken'],
                'user'      => $user->toArray($this->wRequest()->getFields('*,!password'))
            ];
        })->setBodyValidators(['username' => 'required,email', 'password' => 'required']);

        /**
         * @api.name        My profile
         * @api.description Returns currently logged in user's data.
         * @api.headers.X-Webiny-Authorization  string  Authorization token
         */
        $this->api('GET', 'me', function () {
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
        $this->api('PATCH', 'me', function () {
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
        $this->api('POST', 'reset-password', function () {
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
        $this->api('POST', '/set-password', function () {
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
        return $this->roles;
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