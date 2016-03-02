<?php
namespace Apps\Core\Php\DevTools\Authorization;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\Entities\User;
use Apps\Core\Php\RequestHandlers\ApiException;
use Webiny\Component\Security\Security;
use Webiny\Component\Security\SecurityTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Login\Login as LoginApp;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Login\LoginException;

/**
 * Class Login
 */
class Authorization
{
    use DevToolsTrait, SingletonTrait, SecurityTrait, StdLibTrait, AuthorizationTrait;

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
        if ($this->user) {
            return $this->user;
        }

        $authCookie = $this->wRequest()->header('Authorization');

        try {
            $class = $this->userClass;
            $user = $this->login->getUser($authCookie);
            $this->user = $class::findOne(['email' => $user->getUsername()]);
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

            $class = $this->userClass;
            $this->user = $class::findOne(['email' => $username]);

            if ($this->user && $this->user->enabled) {
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

    protected function getUserToAuthorize()
    {
        return $this->getUser();
    }

}