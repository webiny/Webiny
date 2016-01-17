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

        $entity = $entity->findById($id);
        if ($entity) {
            try {
                // TODO: handle all use cases with Reflection and throw errors if entities not found, etc.
                // TODO: need to validate all required parameters - at least the number of required parameters and their data types
                $params = array_slice($params, 2);

                $rc = new \ReflectionClass($entity);
                $rm = $rc->getMethod($method);
                $param = $rm->getParameters()[0];
                $params[0] = call_user_func_array([$param->getClass()->getName(), 'findById'], [$params[0]]);

                if($this->wRequest()->isPost()){
                    $params[] = $this->wRequest()->getRequestData();
                }

                return $entity->$method(...$params);
            } catch (ExceptionAbstract $e) {
                throw new ApiException($e->getMessage(), $e->getMessage(), 'WBY-EME-1', 400);
            }
        }

        throw new ApiException('Not found', get_class($entity) . ' with id `' . $id . '` was not found!');
    }

    public function canHandle($httpMethod, $params)
    {
        return in_array($httpMethod, ['GET', 'POST']) && count($params) >= 2;
    }
}