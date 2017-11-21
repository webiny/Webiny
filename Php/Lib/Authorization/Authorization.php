<?php

namespace Apps\Webiny\Php\Lib\Authorization;

use Apps\Webiny\Php\Entities\SystemApiTokenUser;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\Interfaces\PublicApiInterface;
use Apps\Webiny\Php\Lib\Services\AbstractService;
use Apps\Webiny\Php\Lib\WebinyTrait;
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
     * This will be set to true if authorization token has expired
     *
     * @var bool
     */
    private $tokenExpired = false;

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
     * @return bool
     */
    public function hasTokenExpired()
    {
        return $this->tokenExpired;
    }

    /**
     * Get an instance of the user identified by X-Webiny-Authorization token.
     * A user can be a regular user, System token or API token - but they all implement `UserInterface`.
     * @return User
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

            if ($requestToken) {
                try {
                    /* @var $user \Webiny\Component\Security\User\AbstractUser */
                    $user = $this->login->getUser($requestToken);
                    $this->user = $this->wUser()->byEmail($user->getUsername());

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
                        $this->tokenExpired = true;
                        return null;
                    }
                }
            }

            // API tokens may contain special characters and will be urlencoded when sent through curl
            $requestToken = urldecode($requestToken);
            $this->user = $this->wUser()->byToken($requestToken);
        }

        return $this->user;
    }

    public function processLogin($username)
    {
        // Make sure we always process lowercase emails
        $username = strtolower($username);
        try {
            $this->login->processLogin($username);

            $this->user = $this->wUser()->byEmail($username);

            if ($this->user && $this->user->type === 'service') {
                throw new ApiException('Login is disabled for service users.', 'WBY-LOGIN-DISABLED', 401);
            }

            if ($this->user && $this->user->enabled) {
                $this->user->trigger('onLoginSuccess');

                // if login is successful, return authentication token
                return [
                    'authToken' => $this->login->getAuthToken()
                ];
            }
        } catch (LoginException $le) {
            throw new ApiException($le->getMessage(), 'WBY-INVALID-CREDENTIALS', 401);
        } catch (\Exception $e) {
            throw new ApiException($e->getMessage());
        }

        return null;
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
        if (!$this->wConfig()->get('Webiny.Acl.CheckUserPermissions', true) || $this->getUser() instanceof SystemApiTokenUser) {
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