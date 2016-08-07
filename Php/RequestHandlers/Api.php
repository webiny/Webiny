<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\RequestHandlers;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Exceptions\AppException;
use Apps\Core\Php\DevTools\Response\ApiErrorResponse;
use Apps\Core\Php\DevTools\Response\ApiRawResponse;
use Apps\Core\Php\Discover\Parser\AppParser;
use Apps\Core\Php\Discover\Postman;
use Webiny\Component\StdLib\StdLibTrait;

class Api
{
    use WebinyTrait, StdLibTrait;

    private $apiResponse = '\Apps\Core\Php\DevTools\Response\ApiResponse';
    private $apiEvent;

    public function handle()
    {
        $url = $this->wRequest()->getCurrentUrl();
        if (!$this->str($url)->startsWith($this->wConfig()->get('Application.ApiPath'))) {
            return false;
        }

        try {
            header("Access-Control-Allow-Origin: *");
            $this->apiEvent = new ApiEvent();

            $events = [
                'Core.Api.Before',
                'Core.Api.Request'
            ];

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
        } catch (\Exception $e) {
            return new ApiErrorResponse(null, $e->getMessage(), $e->getCode(), 404);
        }
    }
}