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
use Webiny\Component\Entity\EntityException;

/**
 * Class CrudUpdateFlow
 * @package Apps\Core\Php\Dispatchers
 */
class CrudUpdateFlow extends AbstractFlow
{

    public function handle(EntityAbstract $entity, $params)
    {
        $id = $params[0];
        $data = $this->wRequest()->getRequestData();
        if (!$this->isArray($data) && !$this->isArrayObject($data)) {
            throw new ApiException('Invalid data provided', 'Invalid data provided for entity populate()', '', 400);
        }

        $entity = $entity->findById($id);
        if ($entity) {
            try {
                $entity->populate($data);
                $entity->save();

                return $entity->toArray($this->wRequest()->getFields(), $this->wRequest()->getFieldsDepth());
            } catch (EntityException $e) {
                throw new ApiException($e->getMessage(), 'WBY-ED-CRUD_UPDATE_FLOW-1', 422, $e->getInvalidAttributes());
            }
        }

        throw new ApiException(get_class($entity) . ' with id `' . $id . '` was not found!', 'WBY-ED-CRUD_UPDATE_FLOW-2');
    }

    public function canHandle($httpMethod, $params)
    {
        return $httpMethod === 'PATCH' && count($params) === 1 && $this->isValidMongoId($params[0]);
    }
}