<?php
namespace Apps\Core\Php\DevTools\Login;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\Entities\User;
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

        return null;
    }

    protected function getUserToAuthorize()
    {
        return $this->getUser();
    }

}