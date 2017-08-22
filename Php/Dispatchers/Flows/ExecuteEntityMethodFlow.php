<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Dispatchers\Flows;

use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;
use Apps\Webiny\Php\DevTools\Exceptions\AppException;
use Apps\Webiny\Php\DevTools\Reports\ReportInterface;
use Apps\Webiny\Php\RequestHandlers\ApiException;
use Webiny\Component\Entity\Attribute\Validation\ValidationException;
use Webiny\Component\Entity\EntityException;
use Webiny\Component\StdLib\Exception\AbstractException;

/**
 * Class ExecuteMethodFlow
 * @package Apps\Webiny\Php\Dispatchers\Flows
 */
class ExecuteEntityMethodFlow extends AbstractFlow
{
    public function handle(AbstractEntity $entity, $params)
    {
        $httpMethod = strtolower($this->wRequest()->getRequestMethod());
        $matchedMethod = $entity->getApi()->getMethod($httpMethod, join('/', $params));

        if (!$matchedMethod) {
            $message = 'No method matched the requested URL in ' . get_class($entity);
            throw new ApiException($message, 'WBY-ED-EXECUTE_METHOD_FLOW-3');
        }

        $apiMethod = $matchedMethod->getApiMethod();
        $params = $matchedMethod->getParams();

        $pattern = $apiMethod->getPattern() . '.' . $httpMethod;
        if (!$apiMethod->getPublic() && !$this->wAuth()->canExecute($entity, $pattern)) {
            $message = 'You are not authorized to execute ' . strtoupper($httpMethod) . ':' . $apiMethod->getPattern() . ' on ' . get_class($entity);
            throw new ApiException($message, 'WBY-AUTHORIZATION', 401);
        }

        $id = $params['id'] ?? null;

        $bindTo = null;
        if ($id) {
            $entity = $entity->findById($id);
            if (!$entity) {
                throw new ApiException(get_class($entity) . ' with id `' . $id . '` was not found!', 'WBY-ED-EXECUTE_METHOD_FLOW-2');
            }
            $bindTo = $entity;
        }

        $code = 'WBY-ED-EXECUTE_METHOD_FLOW';
        try {
            $result = $apiMethod($params, $bindTo);
            if ($result instanceof ReportInterface) {
                $result->getReport(false);
                die();
            }

            return $result;
        } catch (ApiException $e) {
            throw $e;
        } catch (AppException $e) {
            throw $e;
        } catch (ValidationException $e) {
            throw new ApiException($e->getMessage(), $code, 400, iterator_to_array($e->getIterator()));
        } catch (EntityException $e) {
            throw new ApiException($e->getMessage(), $code, 400, $e->getInvalidAttributes());
        } catch (AbstractException $e) {
            throw new ApiException($e->getMessage(), $code, 400);
        }
    }

    public function canHandle($httpMethod, $params)
    {
        return true;
    }
}