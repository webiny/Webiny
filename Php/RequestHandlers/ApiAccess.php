<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\RequestHandlers;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\Entities\ApiToken;
use Apps\Core\Php\Entities\ApiTokenLog;
use Apps\Core\Php\RequestHandlers\ApiEvent;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class ApiAccess
 * @package Apps\Core\Php\RequestHandlers
 */
class ApiAccess
{
    use DevToolsTrait, StdLibTrait;

    public function handle(ApiEvent $event)
    {
        if (!$this->wConfig()->getConfig()->get('Application.ApiTokenControl')) {
            return;
        }

        $req = $this->wRequest();
        // Check if request is coming from your own host
        $referrer = $req->server()->httpReferer();
        $requestHost = $referrer ? $this->url($referrer)->getHost() : null;

        $myHost = $this->wConfig()->getConfig()->get('Application.WebPath');
        if ($this->url($myHost)->getHost() != $requestHost) {
            // Check if referrer has an ApiToken
            $requestToken = $req->header('Api-Token');
            if (!$requestToken) {
                throw new ApiException('The request must include a valid API token', 'INVALID_API_TOKEN');
            }

            $token = ApiToken::findOne(['token' => $requestToken, 'enabled' => true]);
            if (!$token) {
                throw new ApiException('The request must include a valid API token', 'INVALID_API_TOKEN');
            }
            $token->lastActivity = $this->datetime();
            $token->requests = $token->requests + 1;
            $token->save();

            // Save API token log
            $apiTokenLog = new ApiTokenLog();
            $apiTokenLog->token = $token;
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
}