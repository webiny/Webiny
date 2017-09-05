<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @link      http://www.webiny.com/wf-snv for the canonical source repository
 * @copyright Copyright Webiny LTD
 * @license   http://www.webiny.com/framework/license
 */
namespace Apps\Webiny\Php\Lib\Entity\EntityQuery;

/**
 * @package Apps\Webiny\Php\Lib\Entity
 */
class Sorter extends EntityQueryManipulator
{
    protected $type = 'sorter';

    protected function getValue(EntityQuery $query)
    {
        return $query->getSorter($this->name);
    }
}