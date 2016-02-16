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
 * Class CrudListFlow
 * @package Apps\Core\Php\Dispatchers
 */
class CrudListFlow extends AbstractFlow
{

    public function handle(EntityAbstract $entity, $params)
    {
        if (!$this->wAuth()->canRead($entity)) {
            throw new ApiException('You don\'t have a READ permission on ' . get_class($entity), 'WBY-AUTHORIZATION', 403);
        }

        $filters = $this->wRequest()->getFilters();
        $sorter = $this->wRequest()->getSortFields();

        $entities = $entity->find($filters, $sorter, $this->wRequest()->getPerPage(), $this->wRequest()->getPage());
        $response = [
            'meta' => [
                'totalCount'  => $entities->totalCount(),
                'totalPages'  => ceil($entities->totalCount() / $this->wRequest()->getPerPage()),
                'perPage'     => $this->wRequest()->getPerPage(),
                'currentPage' => $this->wRequest()->getPage(),
                'filters'     => $filters,
                'sorter'      => $sorter
            ],
            'list' => $entities->toArray($this->wRequest()->getFields(), $this->wRequest()->getFieldsDepth())
        ];

        return $response;
    }

    public function canHandle($httpMethod, $params)
    {
        return $httpMethod === 'GET' && count($params) === 0;
    }
}