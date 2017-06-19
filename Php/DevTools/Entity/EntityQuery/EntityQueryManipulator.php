<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @link      http://www.webiny.com/wf-snv for the canonical source repository
 * @copyright Copyright Webiny LTD
 * @license   http://www.webiny.com/framework/license
 */

namespace Apps\Webiny\Php\DevTools\Entity\EntityQuery;

use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;
use Apps\Webiny\Php\DevTools\Exceptions\AppException;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * @package Apps\Webiny\Php\DevTools\Entity
 */
class EntityQueryManipulator
{
    use StdLibTrait;

    /**
     * @var string
     */
    protected $type = 'manipulator';

    /**
     * @var string
     */
    protected $name;

    /**
     * @var callable
     */
    private $callback;

    function __construct(string $name, callable $callback)
    {
        $this->name = $name;
        $this->callback = $callback;
    }

    function __invoke(EntityQuery $query)
    {
        $manipulatorValue = $this->getValue($query);
        $filter = $this->callback->bindTo($this);

        $filterParams = [$query];

        // Let's check if any of the Closure parameters are instance of AbstractEntity
        $callback = new \ReflectionFunction($this->callback);
        $parameter = $callback->getParameters()[1] ?? null;
        if ($parameter) {
            $entityClass = $parameter->getClass()->name ?? null;
            if ($entityClass && is_subclass_of($entityClass, 'Apps\Webiny\Php\DevTools\Entity\AbstractEntity')) {
                /* @var AbstractEntity $entityClass */
                if ($entity = $entityClass::findById($manipulatorValue)) {
                    $filterParams[] = $entity;
                } else {
                    throw new AppException('Entity for ' . $this->type . ' "' . $this->getName() . '" not found.');
                }
            } else {
                $filterParams[] = $manipulatorValue;
            }
        }

        $filter(...$filterParams);
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param EntityQuery $query
     *
     * @return array
     */
    protected function getValue(EntityQuery $query)
    {
        return $query->getCondition($this->name);
    }
}