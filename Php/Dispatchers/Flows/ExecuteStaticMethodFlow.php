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
use Webiny\Component\Entity\Attribute\Validation\ValidationException;
use Webiny\Component\StdLib\Exception\ExceptionAbstract;

/**
 * Class ExecuteStaticMethodFlow
 * @package Apps\Core\Php\Dispatchers
 */
class ExecuteStaticMethodFlow extends AbstractFlow
{

    public function handle(EntityAbstract $entity, $params)
    {
        $method = $this->str($params[0])->camelCase()->val();
        $httpMethod = strtolower($this->wRequest()->getRequestMethod());
        $entityMethod = $entity->getApiMethod($httpMethod, $method);

        if (!$entityMethod) {
            $message = 'Method \'' . strtoupper($httpMethod) . ' ' . $method . '\' is not exposed in ' . get_class($entity);
            throw new ApiException($message, 'WBY-ED-EXECUTE_STATIC_METHOD_FLOW-1');
        }

        if (!$this->wAuth()->canExecute($entity, $method . '.' . $httpMethod)) {
            throw new ApiException('You don\'t have an EXECUTE permission on ' . get_class($entity), 'WBY-AUTHORIZATION', 401);
        }

        try {
            return $entityMethod(array_slice($params, 1));
        } catch (ApiException $e) {
            throw $e;
        } catch (ValidationException $e) {
            throw new ApiException($e->getMessage(), 'WBY-ED-EXECUTE_STATIC_METHOD_FLOW', 400, iterator_to_array($e->getIterator()));
        } catch (ExceptionAbstract $e) {
            throw new ApiException($e->getMessage(), 'WBY-ED-EXECUTE_STATIC_METHOD_FLOW', 400);
        }
    }

    public function canHandle($httpMethod, $params)
    {
        return in_array($httpMethod, ['GET', 'POST', 'PATCH', 'DELETE']) && count($params) >= 1 && !$this->mongo()->isId($params[0]);
    }
}