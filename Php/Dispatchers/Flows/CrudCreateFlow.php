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
        try {
            $data = $this->wRequest()->getRequestData();

            if (!$this->isArray($data) && !$this->isArrayObject($data)) {
                throw new ApiException('Invalid data provided', 'Invalid data provided for entity populate()', '', 400);
            }
            $entity->populate($data)->save();
        } catch (EntityException $e) {
            if ($e->getCode() == EntityException::VALIDATION_FAILED) {
                $exception = new ApiException($e->getMessage(), 'Entity attribute validation failed', '', 422);
                foreach ($e->getInvalidAttributes() as $attrName => $attrError) {
                    $exception->addError([$attrName => $attrError]);
                }
                throw $exception;
            }
        }

        return $entity->toArray($this->wRequest()->getFields(), $this->wRequest()->getFieldsDepth());
    }

    public function canHandle($httpMethod, $params)
    {
        return $httpMethod === 'POST' && count($params) === 0;
    }
}