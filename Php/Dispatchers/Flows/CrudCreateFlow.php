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
 * Class CrudCreateFlow
 * @package Apps\Core\Php\Dispatchers
 */
class CrudCreateFlow extends AbstractFlow
{

    public function handle(AbstractEntity $entity, $params)
    {
        if (!$this->wAuth()->canCreate($entity)) {
            throw new ApiException('You don\'t have a CREATE permission on ' . get_class($entity), 'WBY-AUTHORIZATION', 401);
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

            $code = $e->getCode();
            if (!$code) {
                $code = 'WBY-ED-CRUD_CREATE_FLOW-2';
            }
            throw new ApiException($e->getMessage(), $code, 422);
        }

        return $entity->toArray($this->wRequest()->getFields());
    }

    public function canHandle($httpMethod, $params)
    {
        return $httpMethod === 'POST' && count($params) === 0;
    }
}