<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\RequestHandlers;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Exceptions\AppException;
use Apps\Core\Php\DevTools\Response\ApiErrorResponse;
use Apps\Core\Php\DevTools\Response\ApiRawResponse;
use Apps\Core\Php\Discover\Parser\AppParser;
use Apps\Core\Php\Discover\Postman;

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
        $this->apiEvent = new ApiEvent();

        $apiUrl = $this->apiEvent->getUrl();
        if ($apiUrl->startsWith('/discover')) {
            $app = $apiUrl->replace('/discover/', '')->pascalCase()->val();
            $appParser = new AppParser($app);
            $docs = new Postman();

            return new ApiRawResponse($docs->generate($appParser));
        }

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
        } catch (AppException $e) {
            return new ApiErrorResponse($e->getData(), $e->getErrorMessage(), $e->getErrorCode(), 404);
        }
    }
}