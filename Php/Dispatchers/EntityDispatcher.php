<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Dispatchers;

use Apps\Webiny\Php\DevTools\Response\ApiErrorResponse;
use Apps\Webiny\Php\DevTools\Response\ApiResponse;
use Apps\Webiny\Php\Dispatchers\Flows\AbstractFlow;
use Apps\Webiny\Php\RequestHandlers\ApiEvent;

/**
 * Class EntityDispatcher
 * @package Apps\Webiny\Php\Dispatchers
 */
class EntityDispatcher extends AbstractApiDispatcher
{
    public function handle(ApiEvent $event)
    {
        if (!$event->getUrl()->startsWith('/entities')) {
            return false;
        }

        $request = $this->parseUrl($event->getUrl()->replace('/entities', ''));
        $httpMethod = $this->wRequest()->getRequestMethod();
        $params = $request['params'];

        $singular = $entityClass = '\\Apps\\' . $request['app'] . '\\Php\\Entities\\' . $this->str($request['class'])->singularize();
        if (!$this->fileExists($singular) || !class_exists($singular)) {
            // Check if entity class  exists in plural form
            $plural = '\\Apps\\' . $request['app'] . '\\Php\\Entities\\' . $request['class'];
            if (!$this->fileExists($plural) || !class_exists($plural)) {
                return new ApiErrorResponse([], 'Entity class ' . $singular . ' does not exist!', 'WBY-CLASS_NOT_FOUND');
            }
            $entityClass = $plural;
        }

        $flows = $this->wService()->getServicesByTag('entity-dispatcher-flow', '\Apps\Webiny\Php\Dispatchers\Flows\AbstractFlow');

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