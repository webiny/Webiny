<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Dispatchers;

use Apps\Webiny\Php\DevTools\Authorization\SystemApiToken;
use Apps\Webiny\Php\DevTools\Request;
use Apps\Webiny\Php\Entities\ApiLog;
use Apps\Webiny\Php\Entities\ApiToken;
use Apps\Webiny\Php\Entities\User;
use Apps\Webiny\Php\RequestHandlers\ApiEvent;

/**
 * Class ApiLog
 *
 * @package Apps\Webiny\Php\Dispatchers
 */
class ApiLogger extends AbstractApiDispatcher
{
    public function handle(ApiEvent $event)
    {
        $user = $this->wAuth()->getUser();
        $request = $this->wRequest();

        if ($user instanceof User) {
            if ($this->wConfig()->get('Application.Acl.LogUserRequests', false)) {
                $this->saveTokenLog($request, $user);

            }

            return;
        }

        if ($user instanceof ApiToken) {
            /* @var ApiToken $user */
            $user->lastActivity = $this->datetime();
            $user->requests += 1;
            $user->save();

            if ($user->logRequests) {
                $this->saveTokenLog($request, $user);
            }

            return;
        }

        if ($user instanceof SystemApiToken) {
            if ($this->wConfig()->get('Application.Acl.LogSystemApiTokenRequests', false)) {
                $this->saveTokenLog($request, 'system');
            }
        }
    }

    private function saveTokenLog(Request $req, $token)
    {
        $apiTokenLog = new ApiLog();

        if ($token instanceof ApiToken || is_string($token)) {
            $apiTokenLog->token = is_string($token) ? $token : $token->id;
        }

        if ($this->isInstanceOf($token, $this->wAuth()->getUserClass())) {
            $apiTokenLog->user = $token;
        }

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