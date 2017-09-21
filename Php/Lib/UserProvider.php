<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib;

use Apps\Webiny\Php\Entities\ApiToken;
use Apps\Webiny\Php\Entities\SystemApiTokenUser;
use Apps\Webiny\Php\Entities\User;
use Apps\Webiny\Php\Lib\UserProvider\UserProviderEvent;
use Webiny\Component\StdLib\SingletonTrait;

/**
 * Class UserProvider
 *
 * The platform supports multiple user entity classes (all must be derived from the same base User entity class).
 * This class provides a way to load the correct user entity instance by means of a `Webiny.User.Provide` event
 * where multiple event handlers can determine which class should be used to load the user.
 *
 * It is used in situations like loading `user()` attribute value, loading user from `X-Webiny-Authorization` token and directly from code,
 * when you are not sure which user class to use.
 *
 * NOTE: we highly recommend using this class whenever you need to load a user by ID, existing data or other criteria.
 * A method to access this class through WebinyTrait is `wUser()`;
 */
class UserProvider
{
    use SingletonTrait, WebinyTrait;

    private $cache = [];

    /**
     * Get user entity instance by given $id
     *
     * @param string $id
     *
     * @return User|null
     */
    public function byId($id)
    {
        if (!isset($this->cache[$id])) {
            $data = $this->wDatabase()->findOne(User::getCollection(), ['id' => $id, 'deletedOn' => null]);
            if ($data) {
                $this->cache[$id] = $this->byData($data);
            }
        }

        return $this->cache[$id] ?? null;
    }

    /**
     * Get user entity instance by given $email
     *
     * @param string $email
     *
     * @return User|null
     */
    public function byEmail($email)
    {
        if (!isset($this->cache[$email])) {
            $data = $this->wDatabase()->findOne(User::getCollection(), ['email' => $email, 'deletedOn' => null]);
            if ($data) {
                $this->cache[$email] = $this->byData($data);
            }
        }

        return $this->cache[$email]  ?? null;
    }

    /**
     * Get user by token
     *
     * @param string $token
     *
     * @return User|null
     */
    public function byToken($token)
    {
        if (!$token) {
            return null;
        }

        $systemToken = $this->wConfig()->getConfig()->get('Application.Acl.Token');
        if ($systemToken && $systemToken == $token) {
            return SystemApiTokenUser::findOne(['meta.apiToken' => 'system']);
        }

        /* @var $token ApiToken */
        $token = ApiToken::findOne(['token' => $token]);
        if ($token) {
            return $token->user;
        }

        return null;
    }

    /**
     * Get user entity instance by given $query
     *
     * @param array $query
     *
     * @return User|null
     */
    public function byQuery($query)
    {
        if (!isset($query['deletedOn'])) {
            $query['deletedOn'] = null;
        }
        $data = $this->wDatabase()->findOne(User::getCollection(), $query);
        if ($data) {
            return $this->byData($data);
        }

        return null;
    }

    /**
     * Get user entity instance by given $data
     *
     * @param array $data
     *
     * @return User|null
     */
    public function byData($data)
    {
        if (empty($data)) {
            return null;
        }

        return $this->wEvents()->fire('Webiny.User.Provide', new UserProviderEvent($data), User::class, 1);
    }
}
