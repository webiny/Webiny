<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\Dispatchers;

use Apps\Core\Php\DevTools\Response\ApiErrorResponse;
use Apps\Core\Php\DevTools\Response\ApiResponse;
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

        $params = $request['params'];

        $serviceClass = '\\Apps\\' . $request['app'] . '\\Php\\Services\\' . $request['class'];
        if (!class_exists($serviceClass)) {
            return new ApiErrorResponse([], 'Service class ' . $serviceClass . ' does not exist!');
        }

        $service = new $serviceClass;
        if (!method_exists($service, 'getApiMethod')) {
            throw new ApiException('Services must use `ApiExpositionTrait` to expose public API!', 'WBY-SD-INVALID_SERVICE');
        }

        $method = 'index';
        $possibleMethod = null;
        if (isset($params[0])) {
            $possibleMethod = $params[0];
        }

        // Check if method exists
        $serviceMethod = $service->getApiMethod($httpMethod, $method);
        $possibleServiceMethod = $service->getApiMethod($httpMethod, $possibleMethod);

        if ($possibleServiceMethod) {
            array_shift($params);
            $method = $possibleMethod;
            $serviceMethod = $possibleServiceMethod;
        }

        if (!$serviceMethod) {
            $message = 'No applicable methods are exposed in ' . $serviceClass;
            throw new ApiException($message, 'WBY-SD-NO_METHODS_EXPOSED', 404);
        }

        if (!$this->wAuth()->canExecute($serviceClass, $method)) {
            throw new ApiException('You don\'t have an EXECUTE permission on ' . $serviceClass, 'WBY-AUTHORIZATION');
        }

        if ($serviceMethod['callable']) {
            /* @var $method Callable */
            $method = $serviceMethod['callable'];
        }

        $params = $this->injectParams($service, $method, $params);

        $result = is_string($method) ? $service->$method(...$params) : $method(...$params);

        return new ApiResponse($result);
    }
}