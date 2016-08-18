<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Dispatchers;

use Apps\Core\Php\DevTools\Response\ApiErrorResponse;
use Apps\Core\Php\DevTools\Response\ApiResponse;
use Apps\Core\Php\Dispatchers\Flows\AbstractFlow;
use Apps\Core\Php\RequestHandlers\ApiEvent;

/**
 * Class EntityDispatcher
 * @package Apps\Core\Php\Dispatchers
 */
class EntityDispatcher extends AbstractApiDispatcher
{
    public function handle(ApiEvent $event)
    {
        if (!$event->getUrl()->startsWith('/entities')) {
            return false;
        }

        $this->checkApiToken();

        $result = null;
        $request = $this->parseUrl($event->getUrl()->replace('/entities', ''));

        $httpMethod = $this->wRequest()->getRequestMethod();
        $params = $request['params'];

        $entityClass = '\\Apps\\' . $request['app'] . '\\Php\\Entities\\' . $this->str($request['class'])->singularize();
        if (!$this->fileExists($entityClass)) {
            return new ApiErrorResponse([], 'Entity class ' . $entityClass . ' does not exist!', 'WBY-CLASS_NOT_FOUND');
        }

        $flows = $this->wService()->getServicesByTag('entity-dispatcher-flow', '\Apps\Core\Php\Dispatchers\Flows\AbstractFlow');

        usort($flows, function (AbstractFlow $flow1, AbstractFlow $flow2) {
            return $flow1->getPriority() <=> $flow2->getPriority();
        });

        /* @var $flow AbstractFlow */
        foreach ($flows as $flow) {
            if ($flow->canHandle($httpMethod, $params)) {
                return new ApiResponse($flow->handle(new $entityClass(), $params));
            }
        }

        return null;
    }
}