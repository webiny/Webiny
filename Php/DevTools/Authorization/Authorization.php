<?php
namespace Apps\Core\Php\DevTools\Authorization;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Apps\Core\Php\Entities\User;
use Apps\Core\Php\Entities\UserRole;
use Apps\Core\Php\RequestHandlers\ApiException;
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
     * @var LoginApp
     */
    private $login;

    /**
     * @var User
     */
    private $user;

    /**
     * @var string
     */
    private $userClass = 'Apps\Core\Php\Entities\User';

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
        if (!$this->user) {
            $authCookie = $this->wRequest()->header('X-Webiny-Token');

            try {
                /* @var $class AbstractEntity */
                $class = $this->userClass;
                $user = $this->login->getUser($authCookie);
                $this->user = $class::findOne(['email' => $user->getUsername()]);
                $this->user->trigger('onActivity');
            } catch (\Exception $le) {
                return null;
            }
        }

        return $this->user;
    }

    public function processLogin($username)
    {
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

    public function canCreate($class)
    {
        return $this->checkPermission($class, 'crudCreate');
    }

    public function canRead($class)
    {
        return $this->checkPermission($class, 'crudRead');
    }

    public function canUpdate($class)
    {
        return $this->checkPermission($class, 'crudUpdate');
    }

    public function canDelete($class)
    {
        return $this->checkPermission($class, 'crudDelete');
    }

    public function canExecute($class, $method = null)
    {
        return $this->checkPermission($class, $method);
    }

    private function checkPermission($class, $permission)
    {
        if(!$this->wConfig()->get('Application.Acl.CheckUserPermissions', true)){
            return true;
        }

        if (!is_string($class)) {
            $class = get_class($class);
        } else {
            $class = trim($class, '\\');
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
            if ($role->checkPermission($class, $permission)) {
                return true;
            }
        }

        return false;
    }
}