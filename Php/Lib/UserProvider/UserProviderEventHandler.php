<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\UserProvider;

use Apps\Webiny\Php\Entities\ApiToken;
use Apps\Webiny\Php\Entities\SystemApiTokenUser;
use Apps\Webiny\Php\Entities\User;
use Apps\Webiny\Php\Lib\WebinyTrait;

/**
 * This class handles `Webiny.User.Provide` event and returns one if the platform user entities.
 *
 * It is registered with the default event priority of 300.
 * To add your own user provider, register an event handler with higher priority (ex: 310).
 */
class UserProviderEventHandler
{
    use WebinyTrait;

    public function handle(UserProviderEvent $event)
    {
        $data = $event->getData();

        $token = $data['meta']['apiToken'] ?? null;

        if ($token === 'system') {
            return SystemApiTokenUser::load();
        }

        if ($this->wDatabase()->isId($token)) {
            /* @var $apiToken ApiToken */
            $apiToken = ApiToken::findById($token);
            if ($apiToken) {
                return $apiToken->user;
            }
        }

        return isset($data['id']) ? User::findById($data['id']) : null;
    }
}