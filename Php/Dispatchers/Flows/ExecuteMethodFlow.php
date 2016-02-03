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
 * Class ExecuteMethodFlow
 * @package Apps\Core\Php\Dispatchers
 */
class ExecuteMethodFlow extends AbstractFlow
{

    public function handle(EntityAbstract $entity, $params)
    {
        $id = $params[0];
        $method = $this->toCamelCase($params[1]);

        if(!$this->wAuth()->canExecute($entity, $method)){
            throw new ApiException('You don\'t have an EXECUTE permission on ' . get_class($entity));
        }

        $entity = $entity->findById($id);
        if ($entity) {

            $params = $this->injectParams($entity, $method, array_slice($params, 2));

            // If it's a POST request, we pass the payload to the Entity method as a last parameter
            if ($this->wRequest()->isPost()) {
                $params[] = $this->wRequest()->getRequestData();
            }

            try {
                return $entity->$method(...$params);
            } catch (ExceptionAbstract $e) {
                throw new ApiException($e->getMessage(), $e->getMessage(), 'WBY-ED-EXECUTE_METHOD_FLOW-1', 400);
            }
        }

        throw new ApiException(get_class($entity) . ' with id `' . $id . '` was not found!', 'WBY-ED-EXECUTE_METHOD_FLOW-2');
    }

    public function canHandle($httpMethod, $params)
    {
        return in_array($httpMethod, ['GET', 'POST']) && count($params) >= 2;
    }
}