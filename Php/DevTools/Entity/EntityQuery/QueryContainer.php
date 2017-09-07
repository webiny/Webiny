<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\Entity\EntityQuery;

class QueryContainer implements \IteratorAggregate
{
    private $filters = [];

    public function add(Filter $filter)
    {
        $this->filters[] = $filter;

        return $this;
    }

    public function getIterator()
    {
        return new \ArrayIterator($this->filters);
    }
}