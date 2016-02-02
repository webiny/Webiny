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

class ServiceDispatcher extends AbstractApiDispatcher
{
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
        if (count($params) > 0 && method_exists($service, $params[0])) {
            $method = $params[0];
        }

        $result = $service->$method(...$params);

        if ($result) {
            return new ApiResponse($result);
        }

        return null;
    }
}