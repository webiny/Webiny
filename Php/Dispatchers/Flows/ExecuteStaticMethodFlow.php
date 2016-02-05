<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\Dispatchers\Flows;

use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Apps\Core\Php\Dispatchers\AbstractFlow;
use Apps\Core\Php\RequestHandlers\ApiException;
use Webiny\Component\StdLib\Exception\ExceptionAbstract;

/**
 * Class ExecuteStaticMethodFlow
 * @package Apps\Core\Php\Dispatchers
 */
class ExecuteStaticMethodFlow extends AbstractFlow
{

    public function handle(EntityAbstract $entity, $params)
    {
        $method = $this->toCamelCase($params[0]);

        $httpMethod = strtolower($this->wRequest()->getRequestMethod());
        $entityMethod = $entity->getApiMethod($httpMethod, $method);

        if (!$entityMethod) {
            $message = 'Method \'' . $method . '\' is not exposed in ' . get_class($entity);
            throw new ApiException($message, 'WBY-ED-EXECUTE_METHOD_FLOW-1', 404);
        }

        if(!$this->wAuth()->canExecute($entity, $method)){
            throw new ApiException('You don\'t have an EXECUTE permission on ' . get_class($entity), 'WBY-ED-EXECUTE_METHOD_FLOW-2');
        }

        if (isset($entityMethod['callable'])) {
            /* @var $method Callable */
            $method = $entityMethod['callable'];
        }

        $params = $this->injectParams($entity, $method, array_slice($params, 1));

        try {
            return is_string($method) ? $entity::$method(...$params) : $method(...$params);
        } catch (ExceptionAbstract $e) {
            throw new ApiException($e->getMessage(), $e->getMessage(), 'WBY-ED-EXECUTE_STATIC_METHOD_FLOW', 400);
        }
    }

    public function canHandle($httpMethod, $params)
    {
        return in_array($httpMethod, ['GET', 'POST']) && count($params) >= 1 && !$this->isValidMongoId($params[0]);
    }
}