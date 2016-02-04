<?php
namespace Apps\Core\Php\DevTools\Login;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\Entities\User;
use Apps\Core\Php\Entities\UserGroup;
use Apps\Core\Php\Login\LoginException;
use Apps\Core\Php\RequestHandlers\ApiException;
use Webiny\Component\Security\Security;
use Webiny\Component\Security\SecurityTrait;
use Webiny\Component\StdLib\SingletonTrait;
use \Apps\Core\Php\Login\Login as LoginApp;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class Login
 */
class Login
{
    use DevToolsTrait, SingletonTrait, SecurityTrait, StdLibTrait;

    /**
     * @var LoginApp
     */
    private $login;

    /**
     * @var User
     */
    private $user;

    /**
     * @var Security
     */
    private $security;

    protected function init()
    {
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
     * @return User
     */
    public function getUser()
    {
        if ($this->user) {
            return $this->user;
        }

        $authCookie = $this->wRequest()->header('Authorization');

        try {
            $user = $this->login->getUser($authCookie);
            $this->user = User::findOne(['email' => $user->getUsername()]);
        } catch (\Exception $le) {
            return null;
        }

        return $this->user;
    }

    public function processLogin($username)
    {
        try {
            $this->login->processLogin($username);
            // if login is successful, return device and auth tokens
            $authToken = $this->login->getAuthToken();

            $this->user = User::findOne(['email' => $username]);

            if ($this->user && $this->user->enabled) {
                return [
                    'authToken' => $authToken
                ];
            }
        } catch (LoginException $le) {
            throw new ApiException($le->getMessage(), $le->getCode());
        } catch (\Exception $e) {
            throw new ApiException($e->getMessage());
        }
    }

    public function canCreate($class)
    {
        return $this->checkPermission($class, 'create');
    }

    public function canRead($class)
    {
        return $this->checkPermission($class, 'read');
    }

    public function canUpdate($class)
    {
        return $this->checkPermission($class, 'update');
    }

    public function canDelete($class)
    {
        return $this->checkPermission($class, 'delete');
    }

    public function canExecute($class, $method = null)
    {
        return $this->checkPermission($class, $method);
    }

    private function checkPermission($class, $permission)
    {
        if (!is_string($class)) {
            $class = get_class($class);
        } else {
            $class = trim($class, '\\');
        }

        $groups = [UserGroup::findOne(['tag' => 'anonymous'])];
        if ($this->getUser()) {
            foreach ($this->user->groups as $group) {
                $groups[] = $group;
            }
        }

        /* @var $group UserGroup */
        foreach ($groups as $group) {
            if ($this->checkGroupPermission($group, $class, $permission)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if given permission is granted on given entity
     *
     * @param UserGroup     $userGroup
     * @param string|object $item Class
     * @param string        $permission c,r,u,d or any other entity method
     *
     * @return bool
     */
    private function checkGroupPermission(UserGroup $userGroup, $item, $permission)
    {
        $group = $this->str($item)->explode('\\')->filter()->values()->val();

        // We ony handle the common namespace structure. Everything else will be ignored and returned as false
        if ($group[3] != 'Entities' && $group[3] != 'Services') {
            return false;
        }

        $key = strtolower($group[3]) . '.' . $item;

        if (!$userGroup->permissions->keyExistsNested($key)) {
            return false;
        }

        $permissions = $userGroup->permissions->keyNested($key);
        if (isset($permissions[$permission])) {
            return $permissions[$permission];
        }

        return false;
    }
}