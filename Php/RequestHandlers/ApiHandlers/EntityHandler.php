<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\RequestHandlers\ApiHandlers;

use Apps\Webiny\Php\RequestHandlers\ApiHandlers\EntityFlows\AbstractEntityFlow;
use Apps\Webiny\Php\Lib\Response\ApiErrorResponse;
use Apps\Webiny\Php\Lib\Response\ApiResponse;
use Apps\Webiny\Php\RequestHandlers\ApiEvent;
use Apps\Webiny\Php\RequestHandlers\ApiHandlers\EntityFlows\DefaultEntityFlow;

/**
 * Class EntityHandler
 */
class EntityHandler extends AbstractApiHandler
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

        // Get custom entity flows (if any)
        $flows = $this->wService()->getServicesByTag('entity-flow', AbstractEntityFlow::class);

        usort($flows, function (AbstractEntityFlow $flow1, AbstractEntityFlow $flow2) {
            return $flow1->getPriority() <=> $flow2->getPriority();
        });

        /* @var $flow AbstractEntityFlow */
        foreach ($flows as $flow) {
            if ($flow->canHandle($httpMethod, $params)) {
                $response = $flow->handle(new $entityClass(), $params);

                return $response instanceof ApiResponse ? $response : new ApiResponse($response);
            }
        }

        // If no custom flows handled the request - proceed with default flow
        $defaultEntityFlow = new DefaultEntityFlow();
        $response = $defaultEntityFlow->handle(new $entityClass(), $params);

        return $response instanceof ApiResponse ? $response : new ApiResponse($response);
    }
}