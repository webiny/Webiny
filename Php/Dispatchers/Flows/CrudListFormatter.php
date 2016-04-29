<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\Dispatchers\Flows;

use Webiny\Component\Entity\EntityCollection;

/**
 * Class CrudListFormatter
 * Formats given EntityCollection into a CrudList data structure
 *
 * @package Apps\Core\Php\Dispatchers\Flows
 */
class CrudListFormatter
{
    private $collection;

    function __construct(EntityCollection $collection)
    {
        $this->collection = $collection;
    }

    public function format($fields)
    {
        $perPage = $this->collection->getLimit();
        $offset = $this->collection->getOffset();
        $page = 1;
        if ($offset > 0) {
            $page = ($offset / $perPage) + 1;
        }

        return [
            'meta' => [
                'totalCount'  => $this->collection->totalCount(),
                'totalPages'  => ceil($this->collection->totalCount() / $perPage),
                'perPage'     => $perPage,
                'currentPage' => $page
            ],
            'list' => $this->collection->toArray($fields)
        ];

    }
}