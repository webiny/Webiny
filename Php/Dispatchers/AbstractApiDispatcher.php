<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Dispatchers;

use Apps\Core\Php\DevTools\Interfaces\PublicApiInterface;
use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Response\ApiErrorResponse;
use Apps\Core\Php\Entities\ApiToken;
use Apps\Core\Php\Entities\ApiTokenLog;
use Apps\Core\Php\RequestHandlers\ApiException;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

abstract class AbstractApiDispatcher
{
    use WebinyTrait, StdLibTrait;

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
            $requestToken = $req->header('Api-Token');
            $publicAccess = $instance ? $instance instanceof PublicApiInterface : false;

            if ($publicAccess) {
                return;
            }

            if (!$requestToken && !$publicAccess) {
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

    protected function parseUrl(StringObject $url)
    {
        $parts = $url->trim('/')->explode('/', 3);

        if ($parts->count() < 2) {
            return new ApiErrorResponse([], 'Not enough parameters to dispatch API request!');
        }

        $data = [
            'app'    => $this->toPascalCase($parts[0]),
            'class'  => $this->toPascalCase($parts[1]),
            'params' => $this->str($parts->key(2, '', true))->explode('/')->filter()->val()
        ];

        return $data;
    }

    protected function fileExists($class)
    {
        $parts = $this->str($class)->explode('\\')->filter()->values()->val();
        $path = $this->wApps($parts[1])->getVersionPath();
        if ($path) {
            array_splice($parts, 2, 0, $path);
        }

        return file_exists($this->wConfig()->get('Application.AbsolutePath') . join('/', $parts) . '.php');
    }

    protected function toCamelCase($str)
    {
        return $this->str($this->toPascalCase($str))->caseFirstLower()->val();
    }

    protected function toPascalCase($str)
    {
        return $this->str($str)->replace('-', ' ')->caseWordUpper()->replace(' ', '')->val();
    }
}