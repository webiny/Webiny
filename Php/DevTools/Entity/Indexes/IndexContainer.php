<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\Entity\Indexes;

use Traversable;
use Webiny\Component\Mongo\Index\AbstractIndex;

class IndexContainer implements \IteratorAggregate
{
    private $indexes = [];

    /**
     * Add index
     *
     * @param AbstractIndex $newIndex
     *
     * @return $this
     */
    public function add(AbstractIndex $newIndex)
    {
        /* @var $index AbstractIndex */
        foreach ($this->indexes as $i => $index) {
            if ($index->getName() == $newIndex->getName()) {
                $this->indexes[$i] = $newIndex;

                return $this;
            }
        }

        $this->indexes[] = $newIndex;

        return $this;
    }

    /**
     * Remove index by name
     *
     * @param $name
     *
     * @return $this
     */
    public function remove($name)
    {
        /* @var $index AbstractIndex */
        foreach ($this->indexes as $i => $index) {
            if ($index->getName() == $name) {
                unset($this->indexes[$i]);

                return $this;
            }
        }

        return $this;
    }

    /**
     * Check if given index exists
     *
     * @param string $name
     *
     * @return bool
     */
    public function exists($name)
    {
        /* @var $index AbstractIndex */
        foreach ($this->indexes as $i => $index) {
            if ($index->getName() == $name) {
                return true;
            }
        }

        return false;
    }

    /**
     * Retrieve an external iterator
     * @link http://php.net/manual/en/iteratoraggregate.getiterator.php
     * @return Traversable An instance of an object implementing <b>Iterator</b> or
     * <b>Traversable</b>
     * @since 5.0.0
     */
    public function getIterator()
    {
        return new \ArrayIterator($this->indexes);
    }
}
