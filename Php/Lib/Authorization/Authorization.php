<?php

namespace Apps\Webiny\Php\Lib\Authorization;

use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\Interfaces\PublicApiInterface;
use Apps\Webiny\Php\Lib\Interfaces\UserInterface;
use Apps\Webiny\Php\Lib\Services\AbstractService;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Entities\ApiToken;
use Apps\Webiny\Php\Entities\User;
use Apps\Webiny\Php\Entities\UserRole;
use Apps\Webiny\Php\RequestHandlers\ApiException;
use Webiny\Component\Security\Security;
use Webiny\Component\Security\SecurityTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Login\Login as LoginApp;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Login\LoginException;

/**
 * Class Authorization
 */
class Authorization
{
    use WebinyTrait, SingletonTrait, SecurityTrait, StdLibTrait;

    /**
     * @var string
     */
    private $tokenHeaderName = 'X-Webiny-Authorization';

    /**
     * @var LoginApp
     */
    private $login;

    /**
     * @var User
     */
    private $user;

    /**
     * Tells us if user was checked (used later to decide if complete check is needed or not).
     * @var
     */
    private $initialized = false;

    /**
     * @var string
     */
    private $userClass = User::class;

    /**
     * @var Security
     */
    private $security;

    private $patterns = [
        '/.post'      => 'c',
        '/.get'       => 'r',
        '{id}.get'    => 'r',
        '{id}.patch'  => 'u',
        '{id}.delete' => 'd'
    ];

    protected function init()
    {
        $this->security = Security::getInstance();
        $this->login = new LoginApp($this->security, $this->wConfig()->get('Login'));
    }

    /**
     * Reset authorization instance
     * This will delete reference to current user and reset Security component and Login app.
     *
     * Subsequent call to `getUser()` will execute the entire authentication process from scratch.
     */
    public function reset()
    {
        $this->user = null;
        $this->initialized = false;
        Security::deleteInstance();
        $this->security = Security::getInstance();
        $this->login = new LoginApp($this->security, $this->wConfig()->get('Login'));
    }

    /**
     * Create password hash
     *
     * @param $password
     *
     * @return string
     * @throws \Webiny\Component\Security\SecurityException
     */
    public function createPasswordHash($password)
    {
        return $this->security->firewall('Webiny')->createPasswordHash($password);
    }

    /**
     * @return Security
     */
    public function getSecurity()
    {
        return $this->security;
    }

    /**
     * @return LoginApp
     */
    public function getLogin()
    {
        return $this->login;
    }

    /**
     * Get an instance of the user identified by X-Webiny-Authorization token.
     * A user can be a regular user, System token or API token - but they all implement `UserInterface`.
     * @return UserInterface
     * @throws ApiException
     */
    public function getUser()
    {
        if (!$this->user && !$this->initialized) {
            $request = $this->wRequest();
            $this->initialized = true;
            $requestToken = $request->header($this->tokenHeaderName);
            if (!$requestToken) {
                $requestToken = $request->getRequestData()[$this->tokenHeaderName] ?? null;
            }

            /* @var $class AbstractEntity */
            $class = $this->userClass;
            if ($requestToken) {
                try {
                    /* @var $user \Webiny\Component\Security\User\AbstractUser */
                    $user = $this->login->getUser($requestToken);
                    $this->user = $class::findOne(['email' => $user->getUsername()]);

                    if ($this->user) {
                        $this->user->trigger('onActivity');
                    }

                    return $this->user;
                } catch (LoginException $le) {
                    // Do not throw exception if the request is an attempt to login
                    if ($request->isPost() && $request->getCurrentUrl(true)->getPath(true)->endsWith('/login')) {
                        return null;
                    }

                    // Token expired
                    if ($le->getCode() === 7) {
                        throw new ApiException($le->getMessage(), 'WBY-AUTH-TOKEN-EXPIRED', 401);
                    }
                }
            }

            // API tokens may contain special characters and will be urlencoded when sent through curl
            $requestToken = urldecode($requestToken);
            $systemToken = $this->wConfig()->getConfig()->get('Application.Acl.Token');
            if ($systemToken && $systemToken == $requestToken) {
                $this->user = new SystemApiToken();
            } else {
                $this->user = ApiToken::findOne(['token' => $requestToken]);
            }
        }

        return $this->user;
    }

    public function processLogin($username)
    {
        // Make sure we always process lowercase emails
        $username = strtolower($username);
        try {
            $this->login->processLogin($username);
            // if login is successful, return device and auth tokens
            $authToken = $this->login->getAuthToken();

            /* @var $class AbstractEntity */
            $class = $this->userClass;
            $this->user = $class::findOne(['email' => $username]);

            if ($this->user && $this->user->enabled) {
                $this->user->trigger('onLoginSuccess');

                return [
                    'authToken' => $authToken
                ];
            }
        } catch (LoginException $le) {
            throw new ApiException($le->getMessage(), 'WBY-INVALID-CREDENTIALS', 401);
        } catch (\Exception $e) {
            throw new ApiException($e->getMessage());
        }

        return null;
    }

    public function setUserClass(User $entity)
    {
        $this->userClass = get_class($entity);

        return $this;
    }

    public function getUserClass()
    {
        return $this->userClass;
    }

    public function canCreate($class)
    {
        return $this->checkPermission($class, 'c');
    }

    public function canRead($class)
    {
        return $this->checkPermission($class, 'r');
    }

    public function canUpdate($class)
    {
        return $this->checkPermission($class, 'u');
    }

    public function canDelete($class)
    {
        return $this->checkPermission($class, 'd');
    }

    public function canExecute($class, $method = null)
    {
        return $this->checkPermission($class, $method);
    }

    /**
     * @param string|object $class ApiExpositionTrait instance
     * @param string        $permission
     *
     * @return bool
     * @throws AppException
     */
    private function checkPermission($class, $permission)
    {
        if (!$this->wConfig()->get('Application.Acl.CheckUserPermissions', true) || $this->getUser() instanceof SystemApiToken) {
            return true;
        }

        $class = !is_string($class) ? get_class($class) : $class;
        if (!is_string($class::getClassId())) {
            throw new AppException($class . ' must declare a $classId property');
        }

        $class = trim($class, '\\');
        $classId = $class::getClassId();

        $isService = in_array(AbstractService::class, class_parents($class));
        if ($isService && in_array(PublicApiInterface::class, class_implements($class))) {
            return true;
        }

        $user = $this->getUser();
        $roles = [UserRole::findOne(['slug' => 'public'])];
        if ($user) {
            foreach ($user->getUserRoles() as $role) {
                $roles[] = $role;
            }
        }


        /* @var $role UserRole */
        foreach ($roles as $role) {
            if ($role->checkPermission($classId, $permission)) {
                return true;
            }

            // Check if given permission pattern is a crud pattern
            if (isset($this->patterns[$permission]) && $role->checkPermission($classId, $this->patterns[$permission])) {
                return true;
            }
        }

        return false;
    }
}