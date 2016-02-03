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
 * Class CrudCreateFlow
 * @package Apps\Core\Php\Dispatchers
 */
class CrudCreateFlow extends AbstractFlow
{

    public function handle(EntityAbstract $entity, $params)
    {
        if (!$this->wLogin()->canCreate($entity)) {
            throw new ApiException('You don\'t have a CREATE permission on ' . get_class($entity));
        }

        try {
            $data = $this->wRequest()->getRequestData();

            if (!$this->isArray($data) && !$this->isArrayObject($data)) {
                throw new ApiException('Invalid data provided', 'WBY-ED-CRUD_CREATE_FLOW-1', 400);
            }
            $entity->populate($data)->save();
        } catch (EntityException $e) {
            if ($e->getCode() == EntityException::VALIDATION_FAILED) {
                throw new ApiException($e->getMessage(), 'WBY-ED-CRUD_CREATE_FLOW-2', 422, $e->getInvalidAttributes());
            }
        }

        return $entity->toArray($this->wRequest()->getFields(), $this->wRequest()->getFieldsDepth());
    }

    public function canHandle($httpMethod, $params)
    {
        return $httpMethod === 'POST' && count($params) === 0;
    }
}