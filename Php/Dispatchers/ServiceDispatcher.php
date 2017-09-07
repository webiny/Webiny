<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Dispatchers;

use Apps\Webiny\Php\Lib\Api\MatchedApiMethod;
use Apps\Webiny\Php\Lib\Interfaces\PublicApiInterface;
use Apps\Webiny\Php\Lib\Response\ApiErrorResponse;
use Apps\Webiny\Php\Lib\Response\ApiResponse;
use Apps\Webiny\Php\Lib\Services\AbstractService;
use Apps\Webiny\Php\RequestHandlers\ApiEvent;
use Apps\Webiny\Php\RequestHandlers\ApiException;

class ServiceDispatcher extends AbstractApiDispatcher
{
    public function handle(ApiEvent $event)
    {
        if (!$event->getUrl()->startsWith('/services')) {
            return false;
        }

        $result = null;
        $url = substr_replace($event->getUrl(), '', 0, 9);
        $request = $this->parseUrl($this->str($url));
        $httpMethod = strtolower($this->wRequest()->getRequestMethod());

        $url = join('/', $request['params']);

        $serviceClass = '\\Apps\\' . $request['app'] . '\\Php\\Services\\' . $request['class'];

        if (!$this->fileExists($serviceClass)) {
            return new ApiErrorResponse([], 'Service class ' . $serviceClass . ' does not exist!', 'WBY-CLASS_NOT_FOUND');
        }

        /* @var $service AbstractService */
        $service = new $serviceClass;
        if (!method_exists($service, 'getApi')) {
            throw new ApiException('Services must use `ApiExpositionTrait` to expose public API!', 'WBY-SD-INVALID_SERVICE');
        }

        /* @var $matchedServiceMethod MatchedApiMethod */
        $matchedServiceMethod = $service->getApi()->matchMethod($httpMethod, $url);

        if (!$matchedServiceMethod) {
            $message = 'No applicable methods are exposed in ' . $serviceClass;
            throw new ApiException($message, 'WBY-SD-NO_METHODS_EXPOSED', 404);
        }

        $apiMethod = $matchedServiceMethod->getApiMethod();
        $isPublic = $service instanceof PublicApiInterface || $apiMethod->getPublic();

        if (!$isPublic) {
            $pattern = $apiMethod->getPattern() . '.' . $httpMethod;
            if (!$this->wAuth()->canExecute($serviceClass, $pattern)) {
                throw new ApiException('You don\'t have an EXECUTE permission on ' . $serviceClass, 'WBY-AUTHORIZATION', 401);
            }
        }

        $response = $apiMethod($matchedServiceMethod->getParams());

        return $response instanceof ApiResponse ? $response : new ApiResponse($response);
    }
}