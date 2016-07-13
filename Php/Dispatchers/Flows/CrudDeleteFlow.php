<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Dispatchers\Flows;

use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Apps\Core\Php\Dispatchers\AbstractFlow;
use Apps\Core\Php\RequestHandlers\ApiException;
use Webiny\Component\Entity\EntityException;

/**
 * Class CrudDeleteFlow
 * @package Apps\Core\Php\Dispatchers
 */
class CrudDeleteFlow extends AbstractFlow
{

    public function handle(AbstractEntity $entity, $params)
    {
        if (!$this->wAuth()->canDelete($entity)) {
            throw new ApiException('You don\'t have a DELETE permission on ' . get_class($entity), 'WBY-AUTHORIZATION', 401);
        }

        $id = $params[0];
        $entity = $entity->findById($id);
        if ($entity) {
            try {
                $entity->delete();
            } catch (EntityException $e) {
                throw new ApiException('Failed to delete entity! ' . $e->getMessage(), $e->getCode(), 400);
            }

            return true;
        }

        throw new ApiException(get_class($entity) . ' with id `' . $id . '` was not found!', 'WBY-ED-CRUD_DELETE_FLOW-1');
    }

    public function canHandle($httpMethod, $params)
    {
        return $httpMethod === 'DELETE' && count($params) === 1 && $this->mongo()->isId($params[0]);
    }
}