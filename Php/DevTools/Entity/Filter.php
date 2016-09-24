<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @link      http://www.webiny.com/wf-snv for the canonical source repository
 * @copyright Copyright (c) 2009-2013 Webiny LTD. (http://www.webiny.com)
 * @license   http://www.webiny.com/framework/license
 */

namespace Apps\Core\Php\DevTools\Entity;

use Apps\Core\Php\DevTools\Exceptions\AppException;
use Closure;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * @package Apps\Core\Php\DevTools\Entity
 */
class Filter
{
    use StdLibTrait;

    private $name;
    /**
     * @var array|Closure
     */
    private $filter;

    function __construct($name, $filter)
    {
        $this->name = $name;
        $this->filter = $filter;
    }

    function __invoke($filterValue = null)
    {
        if (is_array($this->filter)) {
            return $this->filter;
        }

        if (is_callable($this->filter)) {
            $filter = $this->filter->bindTo($this);

            $filterParams = [];
            // Let's check if any of the Closure parameters are instance of AbstractEntity
            $function = new \ReflectionFunction($this->filter);
            foreach ($function->getParameters() as $parameter) {
                $entityClass = $parameter->getClass()->name ?? null;
                if ($entityClass && is_subclass_of($entityClass, 'Apps\Core\Php\DevTools\Entity\AbstractEntity')) {
                    /* @var AbstractEntity $entityClass */
                    if ($entity = $entityClass::findById($filterValue)) {
                        $filterParams[] = $entity;
                    } else {
                        throw new AppException('Entity for filter "' . $this->getName() . '" not found.');
                    }
                } else {
                    $filterParams[] = $filterValue;
                }
            }

            return $filter(...$filterParams);
        }

        return [];
    }

    public function getName()
    {
        return $this->name;
    }
}