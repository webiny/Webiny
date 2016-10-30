<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Dispatchers;

use Apps\Core\Php\DevTools\Interfaces\PublicApiInterface;
use Apps\Core\Php\DevTools\Request;
use Apps\Core\Php\DevTools\Services\AbstractService;
use Apps\Core\Php\Entities\ApiToken;
use Apps\Core\Php\Entities\ApiTokenLog;
use Apps\Core\Php\RequestHandlers\ApiException;

trait ApiTokenControlTrait
{
    protected function checkApiToken($instance = null)
    {
        if (!$this->wConfig()->getConfig()->get('Application.Acl.ApiTokenControl')) {
            return;
        }

        $req = $this->wRequest();
        // Check if request is coming from your own host
        $referrer = $req->server()->httpReferer();
        $requestHost = $referrer ? $this->url($referrer)->getHost() : null;

        $myHost = $this->wConfig()->getConfig()->get('Application.WebPath');
        if ($this->url($myHost)->getHost() != $requestHost) {
            // Check if referrer has an ApiToken
            $requestToken = $req->query('token');
            if (!$requestToken) {
                $requestToken = $req->header('X-Webiny-Api-Token');
            }

            $isService = $instance instanceof AbstractService;
            $publicAccess = $instance && $isService ? $instance instanceof PublicApiInterface : false;

            if ($publicAccess) {
                return;
            }

            if (!$requestToken && !$publicAccess) {
                throw new ApiException('The request must include a valid API token', 'INVALID_API_TOKEN');
            }

            // First check if system token is used
            $systemToken = $this->wConfig()->getConfig()->get('Application.Acl.Token');
            if ($systemToken && $systemToken == $requestToken) {
                $this->saveTokenLog($req, 'system');

                return;
            }

            $token = ApiToken::findOne(['token' => $requestToken, 'enabled' => true]);
            if (!$token) {
                throw new ApiException('The request must include a valid API token', 'INVALID_API_TOKEN');
            }
            $token->lastActivity = $this->datetime();
            $token->requests = $token->requests + 1;
            $token->save();

            $this->saveTokenLog($req, $token);
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