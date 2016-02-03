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

        $params = $request['params'];

        $serviceClass = '\\Apps\\' . $request['app'] . '\\Php\\Services\\' . $request['class'];
        if (!class_exists($serviceClass)) {
            return new ApiErrorResponse([], 'Service class ' . $serviceClass . ' does not exist!');
        }

        $service = new $serviceClass;

        $method = 'index';

        $possibleMethod = null;
        if (isset($params[0])) {
            $possibleMethod = $this->toCamelCase($params[0]);
        }
        if (count($params) > 0 && method_exists($service, $possibleMethod)) {
            $method = $possibleMethod;
            array_shift($params);
        }

        if (!$this->wLogin()->canExecute($serviceClass, $method)) {
            throw new ApiException('You don\'t have an EXECUTE permission on ' . $serviceClass);
        }

        $result = $service->$method(...$this->injectParams($serviceClass, $method, $params));

        return new ApiResponse($result);
    }
}