<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\Entity\EntityQuery;

class QueryContainer implements \IteratorAggregate
{
    private $queryManipulators = [];

    public function add(EntityQueryManipulator $manipulator)
    {
        $this->queryManipulators[] = $manipulator;

        return $this;
    }

    public function getIterator()
    {
        return new \ArrayIterator($this->queryManipulators);
    }
}