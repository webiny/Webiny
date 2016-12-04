<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Dispatchers;

use Apps\Core\Php\DevTools\Authorization\SystemApiToken;
use Apps\Core\Php\DevTools\Request;
use Apps\Core\Php\Entities\ApiToken;
use Apps\Core\Php\Entities\ApiTokenLog;
use Apps\Core\Php\RequestHandlers\ApiEvent;

/**
 * Class ApiLog
 *
 * @package Apps\Core\Php\Dispatchers
 */
class ApiLog extends AbstractApiDispatcher
{
    public function handle(ApiEvent $event)
    {
        $user = $this->wAuth()->getUser();
        $request = $this->wRequest();
        if ($user instanceof ApiToken) {
            /* @var ApiToken $user */
            $user->lastActivity = $this->datetime();
            $user->requests += 1;
            $user->save();

            $this->saveTokenLog($request, $user);
        } elseif ($user instanceof SystemApiToken) {
            $this->saveTokenLog($request, 'system');
        }
    }

    private function saveTokenLog(Request $req, $token)
    {
        $apiTokenLog = new ApiTokenLog();
        $apiTokenLog->token = is_string($token) ? $token : $token->id;
        $apiTokenLog->method = $req->getRequestMethod();
        $apiTokenLog->request = [
            'url'     => $req->getCurrentUrl(),
            'method'  => $req->getRequestMethod(),
            'headers' => $req->header(),
            'query'   => $req->query(),
            'body'    => $req->getRequestData(),
            'server'  => $req->server()->getAll()
        ];
        $apiTokenLog->save();
    }
}