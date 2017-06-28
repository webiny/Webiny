<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Dispatchers;

use Apps\Webiny\Php\DevTools\Authorization\SystemApiToken;
use Apps\Webiny\Php\DevTools\Request;
use Apps\Webiny\Php\Entities\ApiToken;
use Apps\Webiny\Php\Entities\ApiTokenLog;
use Apps\Webiny\Php\RequestHandlers\ApiEvent;

/**
 * Class ApiLog
 *
 * @package Apps\Webiny\Php\Dispatchers
 */
class ApiLog extends AbstractApiDispatcher
{
    public function handle(ApiEvent $event)
    {
        $token = $this->wAuth()->getUser();
        $request = $this->wRequest();
        if ($token instanceof ApiToken) {
            /* @var ApiToken $token */
            $token->lastActivity = $this->datetime();
            $token->requests += 1;
            $token->save();

            if ($token->logRequests) {
                $this->saveTokenLog($request, $token);
            }
        } elseif ($token instanceof SystemApiToken) {
            if ($this->wConfig()->get('Application.Acl.LogSystemApiTokenRequests', false)) {
                $this->saveTokenLog($request, 'system');
            }
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