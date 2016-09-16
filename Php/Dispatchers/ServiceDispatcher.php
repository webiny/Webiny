<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Dispatchers;

use Apps\Core\Php\DevTools\Interfaces\PublicApiInterface;
use Apps\Core\Php\DevTools\Response\ApiErrorResponse;
use Apps\Core\Php\DevTools\Response\ApiResponse;
use Apps\Core\Php\RequestHandlers\ApiEvent;
use Apps\Core\Php\RequestHandlers\ApiException;

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


        $service = new $serviceClass;
        $this->checkApiToken($service);
        if (!method_exists($service, 'getApiMethod')) {
            throw new ApiException('Services must use `ApiExpositionTrait` to expose public API!', 'WBY-SD-INVALID_SERVICE');
        }

        /* @var $matchedServiceMethod MatchedApiMethod */
        $matchedServiceMethod = $service->getApiMethod($httpMethod, $url);

        if (!$matchedServiceMethod) {
            $message = 'No applicable methods are exposed in ' . $serviceClass;
            throw new ApiException($message, 'WBY-SD-NO_METHODS_EXPOSED', 404);
        }

        $isPublic = $service instanceof PublicApiInterface;
        if (!$isPublic && !$this->wAuth()->canExecute($serviceClass, $matchedServiceMethod->getApiMethod()->getPattern())) {
            throw new ApiException('You don\'t have an EXECUTE permission on ' . $serviceClass, 'WBY-AUTHORIZATION');
        }

        $apiMethod = $matchedServiceMethod->getApiMethod();

        return new ApiResponse($apiMethod($matchedServiceMethod->getParams()));
    }
}