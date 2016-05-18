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
use Webiny\Component\Entity\Attribute\DateTimeAttribute;

/**
 * Class CrudListFlow
 * @package Apps\Core\Php\Dispatchers
 */
class CrudListFlow extends AbstractFlow
{

    public function handle(EntityAbstract $entity, $params)
    {
        if (!$this->wAuth()->canRead($entity)) {
            throw new ApiException('You don\'t have a READ permission on ' . get_class($entity), 'WBY-AUTHORIZATION', 401);
        }

        $filters = $this->buildFilters($entity, $this->wRequest()->getFilters());
        $sorter = $this->wRequest()->getSortFields();

        $entities = $entity->find($filters, $sorter, $this->wRequest()->getPerPage(), $this->wRequest()->getPage());
        $formatter = new CrudListFormatter($entities);

        return $formatter->format($this->wRequest()->getFields());
    }

    public function canHandle($httpMethod, $params)
    {
        return $httpMethod === 'GET' && count($params) === 0;
    }

    protected function buildFilters(EntityAbstract $entity, $filters)
    {
        return $filters;
        $builtFilters = [];
        $attributes = $entity->getAttributes()->val();
        foreach ($filters as $fName => $fValue) {
            if (array_key_exists($fName, $attributes) && $attributes[$fName] instanceof DateTimeAttribute) {
                $builtFilters[$fName] = [
                    '$gte' => $this->datetime()
                ];
            } else {
                $builtFilters[$fName] = $fName;
            }
        }
    }
}