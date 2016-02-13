<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\RequestHandlers;

use Apps\Core\Php\Bootstrap\BootstrapEvent;
use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Response\ApiErrorResponse;
use Apps\Core\Php\DevTools\Response\ApiRawResponse;
use Apps\Core\Php\DevTools\Response\ApiResponse;
use Apps\Core\Php\Lib\PostmanDocs;

class Api
{
    use DevToolsTrait;

    private $apiResponse = '\Apps\Core\Php\DevTools\Response\ApiResponse';
    private $apiEvent;

    public function handle()
    {
        // TODO: handle this smarter, with possibility of having API subdomain
        $path = $this->wRequest()->getCurrentUrl(true)->getPath(true);
        if (!$path->startsWith('/api')) {
            return false;
        }

        header("Access-Control-Allow-Origin: *");

        if ($path->startsWith('/api/discover')) {
            $postmanDocs = new PostmanDocs();
            return new ApiRawResponse($postmanDocs->generate());
        }

        $this->apiEvent = new ApiEvent();

        $events = [
            'Core.Api.Before',
            'Core.Api.Request'
        ];

        try {
            foreach ($events as $event) {
                $response = $this->wEvents()->fire($event, $this->apiEvent, $this->apiResponse, 1);
                if ($response) {
                    return $response;
                }
            }
        } catch (ApiException $e) {
            return new ApiErrorResponse($e->getData(), $e->getErrorMessage(), $e->getErrorCode(), $e->getResponseCode());
        }
    }
}