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

/**
 * Class CrudGetFlow
 * @package Apps\Core\Php\Dispatchers
 */
class CrudGetFlow extends AbstractFlow
{

    public function handle(EntityAbstract $entity, $params)
    {
        if (!$this->wAuth()->canRead($entity)) {
            throw new ApiException('You don\'t have a READ permission on ' . get_class($entity), 'WBY-AUTHORIZATION', 401);
        }

        $id = $params[0];
        try {
            $entity = $entity->findById($id);
            if ($entity) {
                return $entity->toArray($this->wRequest()->getFields());
            }
        } catch (\MongoException $e) {
            throw new ApiException('Database error: ' . $e->getMessage(), $e->getCode(), 400);
        }
        throw new ApiException(get_class($entity) . ' with id `' . $id . '` was not found!', 'WBY-ED-CRUD_GET_FLOW-1');
    }

    public function canHandle($httpMethod, $params)
    {
        return $httpMethod === 'GET' && count($params) === 1 && $this->mongo()->isId($params[0]);
    }
}