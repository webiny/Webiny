<?php
namespace Apps\Core\Php\DevTools\Authorization;

use Apps\Core\Php\DevTools\Interfaces\UserInterface;
use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Apps\Core\Php\Entities\ApiToken;
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

    private $patterns = [
        '/.get'       => 'crudRead',
        '{id}.get'    => 'crudRead',
        '/.post'      => 'crudCreate',
        '{id}.patch'  => 'crudUpdate',
        '{id}.delete' => 'crudDelete'
    ];

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
     * Get an instance of the user identified by X-Webiny-Authorization token.
     * A user can be a regular user, System token or API token - but they all implement `UserInterface`.
     *
     * @return UserInterface
     */
    public function getUser()
    {
        if (!$this->user) {
            $requestToken = $this->wRequest()->header('X-Webiny-Authorization');
            if (!$requestToken) {
                $requestToken = $this->wRequest()->getRequestData()['X-Webiny-Authorization'] ?? null;
            }

            /* @var $class AbstractEntity */
            $class = $this->userClass;
            if ($requestToken) {
                try {
                    $user = $this->login->getUser($requestToken);
                    $this->user = $class::findOne(['email' => $user->getUsername()]);

                    if ($this->user) {
                        $this->user->trigger('onActivity');
                    }
                    
                    return $this->user;
                } catch (\Exception $le) {
                    // Not a regular user
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
        if (!$this->wConfig()->get('Application.Acl.CheckUserPermissions', true) || $this->getUser() instanceof SystemApiToken) {
            return true;
        }

        if (!is_string($class)) {
            $class = get_class($class);
        } else {
            $class = trim($class, '\\');
        }

        $isService = in_array('Apps\Core\Php\DevTools\Services\AbstractService', class_parents($class));
        if ($isService && in_array('Apps\Core\Php\DevTools\Interfaces\NoAuthorizationInterface', class_implements($class))) {
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
}