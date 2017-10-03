<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\RequestHandlers\ApiHandlers;

use Apps\Webiny\Php\Entities\ApiTokenUser;
use Apps\Webiny\Php\Entities\SystemApiTokenUser;
use Apps\Webiny\Php\Lib\Request;
use Apps\Webiny\Php\Entities\ApiLog;
use Apps\Webiny\Php\Entities\ApiToken;
use Apps\Webiny\Php\Entities\User;
use Apps\Webiny\Php\RequestHandlers\ApiEvent;

/**
 * Class ApiLogHandler
 */
class ApiLogHandler extends AbstractApiHandler
{
    public function handle(ApiEvent $event)
    {
        $user = $this->wAuth()->getUser();
        $request = $this->wRequest();

        if ($user instanceof SystemApiTokenUser) {
            if ($this->wConfig()->get('Webiny.Acl.LogSystemApiTokenRequests', false)) {
                $this->saveTokenLog($request, $user);
            }

            return;
        }

        if ($user instanceof ApiTokenUser) {
            $token = $user->getApiToken();
            /* @var ApiToken $user */
            $token->lastActivity = $this->datetime();
            $token->requests += 1;
            $token->save();

            if ($token->logRequests) {
                $this->saveTokenLog($request, $token);
            }

            return;
        }

        if ($user instanceof User) {
            if ($this->wConfig()->get('Webiny.Acl.LogUserRequests', false)) {
                $this->saveTokenLog($request, $user);
            }

            return;
        }

        if (!$user) {
            if ($this->wConfig()->get('Webiny.Acl.LogIncognitoRequests', false)) {
                $this->saveTokenLog($request, null);
            }

            return;
        }
    }

    private function saveTokenLog(Request $req, $user)
    {
        $apiTokenLog = new ApiLog();

        if ($user instanceof SystemApiTokenUser) {
            $apiTokenLog->token = 'system';
        }

        if ($user instanceof ApiToken) {
            $apiTokenLog->token = $user->id;
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