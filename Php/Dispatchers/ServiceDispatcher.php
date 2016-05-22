<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\Dispatchers;

use Apps\Core\Php\DevTools\Response\ApiErrorResponse;
use Apps\Core\Php\DevTools\Response\ApiResponse;
use Apps\Core\Php\Dispatchers\ApiMethod;
use Apps\Core\Php\RequestHandlers\ApiEvent;
use Apps\Core\Php\RequestHandlers\ApiException;

class ServiceDispatcher extends AbstractApiDispatcher
{
    use ParamsInjectorTrait;

    public function handle(ApiEvent $event)
    {
        if (!$event->getUrl()->startsWith('/services')) {
            return false;
        }

        $result = null;
        $request = $this->parseUrl($event->getUrl()->replace('/services', ''));
        $httpMethod = strtolower($this->wRequest()->getRequestMethod());

        $url = join('/', $request['params']);

        $serviceClass = '\\Apps\\' . $request['app'] . '\\Php\\Services\\' . $request['class'];
        if (!class_exists($serviceClass)) {
            return new ApiErrorResponse([], 'Service class ' . $serviceClass . ' does not exist!');
        }

        $service = new $serviceClass;
        if (!method_exists($service, 'getApiMethod')) {
            throw new ApiException('Services must use `ApiExpositionTrait` to expose public API!', 'WBY-SD-INVALID_SERVICE');
        }

        /* @var $matchedServiceMethod MatchedApiMethod */
        $matchedServiceMethod = $service->getApiMethod($httpMethod, $url);

        if (!$matchedServiceMethod) {
            $message = 'No applicable methods are exposed in ' . $serviceClass;
            throw new ApiException($message, 'WBY-SD-NO_METHODS_EXPOSED', 404);
        }

        if (!$this->wAuth()->canExecute($serviceClass, $url)) {
            throw new ApiException('You don\'t have an EXECUTE permission on ' . $serviceClass, 'WBY-AUTHORIZATION');
        }

        $apiMethod = $matchedServiceMethod->getApiMethod();

        return new ApiResponse($apiMethod($matchedServiceMethod->getParams()));
    }
}