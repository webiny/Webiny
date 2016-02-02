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
use Apps\Core\Php\Lib\Inflect;
use Apps\Core\Php\RequestHandlers\ApiEvent;
use Apps\Core\Php\RequestHandlers\ApiException;

/**
 * Class EntityDispatcher
 * @package Apps\Core\Php\Dispatchers
 */
class EntityDispatcher extends AbstractApiDispatcher
{
    protected $flowClass = '\Apps\Core\Php\Dispatchers\AbstractFlow';

    public function handle(ApiEvent $event)
    {
        if (!$event->getUrl()->startsWith('/entities')) {
            return false;
        }

        $result = null;
        $request = $this->parseUrl($event->getUrl()->replace('/entities', ''));

        $httpMethod = $this->wRequest()->getRequestMethod();
        $params = $request['params'];

        $inflector = new Inflect();
        $entityClass = '\\Apps\\' . $request['app'] . '\\Php\\Entities\\' . $inflector->singularize($request['class']);
        if (!class_exists($entityClass)) {
            return new ApiErrorResponse([], 'Entity class ' . $entityClass . ' does not exist!');
        }

        $flows = $this->wService()->getServicesByTag('entity-dispatcher-flow');
        /* @var $flow AbstractFlow */
        foreach ($flows as $flow) {
            if ($this->isInstanceOf($flow, $this->flowClass) && $flow->canHandle($httpMethod, $params)) {
                $result = $flow->handle(new $entityClass(), $params);
                break;
            }
        }

        if ($result) {
            return new ApiResponse($result);
        }

        return null;
    }
}