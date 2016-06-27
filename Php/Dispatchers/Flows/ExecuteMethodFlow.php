<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Dispatchers\Flows;

use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Apps\Core\Php\DevTools\Exceptions\AppException;
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
        $httpMethod = strtolower($this->wRequest()->getRequestMethod());
        $matchedMethod = $entity->getApiMethod($httpMethod, join('/', $params));

        if (!$matchedMethod) {
            $message = 'No method matched the requested URL in ' . get_class($entity);
            throw new ApiException($message, 'WBY-ED-EXECUTE_METHOD_FLOW-3');
        }

        $apiMethod = $matchedMethod->getApiMethod();
        $params = $matchedMethod->getParams();

        if (!$this->wAuth()->canExecute($entity, $apiMethod->getPattern() . '.' . $httpMethod)) {
            $message = 'You don\'t have an EXECUTE permission on ' . $apiMethod->getPattern() . ' in ' . get_class($entity);
            throw new ApiException($message, 'WBY-AUTHORIZATION', 401);
        }

        $id = $params['id'] ?? null;

        $bindTo = null;
        if ($id) {
            unset($params['id']);
            $entity = $entity->findById($id);
            if (!$entity) {
                throw new ApiException(get_class($entity) . ' with id `' . $id . '` was not found!', 'WBY-ED-EXECUTE_METHOD_FLOW-2');
            }
            $bindTo = $entity;
        }

        $code = 'WBY-ED-EXECUTE_METHOD_FLOW';
        try {
            return $apiMethod($params, $bindTo);
        } catch (ApiException $e) {
            throw $e;
        } catch (AppException $e) {
            throw $e;
        } catch (ValidationException $e) {
            throw new ApiException($e->getMessage(), $code, 400, iterator_to_array($e->getIterator()));
        } catch (EntityException $e) {
            throw new ApiException($e->getMessage(), $code, 400, $e->getInvalidAttributes());
        } catch (ExceptionAbstract $e) {
            throw new ApiException($e->getMessage(), $code, 400);
        }
    }

    public function canHandle($httpMethod, $params)
    {
        return count($params) >= 1;
    }
}