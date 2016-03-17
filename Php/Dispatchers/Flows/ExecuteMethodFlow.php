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
use Webiny\Component\Entity\EntityException;
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
        $method = $this->str($params[1])->camelCase()->val();
        $httpMethod = strtolower($this->wRequest()->getRequestMethod());
        $entityMethod = $entity->getApiMethod($httpMethod, $method);

        if (!$entityMethod) {
            $message = 'Method \'' . strtoupper($httpMethod) . ' ' . $method . '\' is not exposed in ' . get_class($entity);
            throw new ApiException($message, 'WBY-ED-EXECUTE_METHOD_FLOW-3');
        }

        if (!$this->wAuth()->canExecute($entity, $method . '.' . $httpMethod)) {
            throw new ApiException('You don\'t have an EXECUTE permission on ' . get_class($entity), 'WBY-AUTHORIZATION', 401);
        }

        $entity = $entity->findById($id);
        if ($entity) {
            try {
                return $entityMethod(array_slice($params, 1));
            } catch (ApiException $e) {
                throw $e;
            } catch (ValidationException $e) {
                throw new ApiException($e->getMessage(), 'WBY-ED-EXECUTE_METHOD_FLOW', 400, iterator_to_array($e->getIterator()));
            } catch (EntityException $e) {
                throw new ApiException($e->getMessage(), 'WBY-ED-EXECUTE_METHOD_FLOW', 400, $e->getInvalidAttributes());
            } catch (ExceptionAbstract $e) {
                throw new ApiException($e->getMessage(), 'WBY-ED-EXECUTE_METHOD_FLOW', 400);
            }
        }

        throw new ApiException(get_class($entity) . ' with id `' . $id . '` was not found!', 'WBY-ED-EXECUTE_METHOD_FLOW-2');
    }

    public function canHandle($httpMethod, $params)
    {
        return count($params) >= 2 && $this->mongo()->isId($params[0]);
    }
}