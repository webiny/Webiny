<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\DevTools\Entity\EntityQuery;

class EntityQuery
{
    /**
     * Holds original parameters that were passed upon object construction.
     * @var EntityQuery
     */
    private $initialParameters = [];

    private $conditions = [];
    private $sorters = [];
    private $limit = 10;
    private $page = 0;
    private $aborted = false;

    public function __construct(array $conditions = [], array $sorters = [], $limit = 0, $page = 0)
    {
        $this->initialParameters = [
            'conditions' => $conditions,
            'sorters'    => $sorters,
            'limit'      => $limit,
            'page'       => $page
        ];

        $this->conditions = $conditions;
        $this->sorters = $sorters;
        $this->limit = $limit;
        $this->page = $page;
    }

    public function abort()
    {
        $this->aborted = true;

        return $this;
    }

    public function isAborted()
    {
        return $this->aborted;
    }

    /**
     * @return array
     */
    public function getConditions()
    {
        return $this->conditions;
    }

    /**
     * @param $key
     *
     * @return array
     */
    public function getCondition($key)
    {
        return $this->conditions[$key] ?? null;
    }

    /**
     * @param $key
     *
     * @return bool
     */
    public function hasCondition($key)
    {
        return isset($this->conditions[$key]);
    }

    /**
     * @param $key
     * @param $condition
     *
     * @return $this
     */
    public function setCondition($key, $condition = null)
    {
        $this->conditions[$key] = $condition;

        return $this;
    }

    /**
     * @param array $conditions
     *
     * @return $this
     */
    public function setConditions(array $conditions)
    {
        foreach ($conditions as $key => $condition) {
            $this->setCondition($key, $condition);
        }

        return $this;
    }

    /**
     * @param array $conditions
     *
     * @return $this
     */
    public function replaceConditions(array $conditions)
    {
        $this->conditions = $conditions;

        return $this;
    }

    /**
     * @param $key
     *
     * @return $this
     */
    public function removeCondition($key)
    {
        unset($this->conditions[$key]);

        return $this;
    }

    /**
     * @param $oldKey
     * @param $key
     *
     * @param $condition
     *
     * @return $this
     */
    public function replaceCondition($oldKey, $key, $condition = null)
    {
        $this->removeCondition($oldKey);
        $this->setCondition($key, $condition);

        return $this;
    }

    /**
     * @return $this
     */
    public function clearConditions()
    {
        $this->conditions = [];

        return $this;
    }

    /**
     * @return array
     */
    public function getSorters()
    {
        return $this->sorters;
    }

    /**
     * @param $key
     *
     * @return array
     */
    public function getSorter($key)
    {
        return $this->sorters[$key] ?? null;
    }

    /**
     * @param $key
     *
     * @return bool
     */
    public function hasSorter($key)
    {
        return isset($this->sorters[$key]);
    }

    /**
     * @param string|array $sorterKey
     * @param int          $sorterOrder
     *
     * @return $this
     */
    public function setSorter($sorterKey, $sorterOrder = 1)
    {
        if (is_bool($sorterOrder)) {
            $sorterOrder = $sorterOrder ? 1 : -1;
        }

        $this->sorters[$sorterKey] = $sorterOrder;

        return $this;
    }

    /**
     * @param array $sorters
     *
     * @return $this
     */
    public function setSorters(array $sorters)
    {
        foreach ($sorters as $key => $sorter) {
            $this->setSorter($key, $sorter);
        }

        return $this;
    }

    /**
     * @param array $sorters
     *
     * @return $this
     */
    public function replaceSorters(array $sorters)
    {
        $this->sorters = $sorters;

        return $this;
    }

    /**
     * @param $key
     *
     * @return $this
     */
    public function removeSorter($key)
    {
        unset($this->sorters[$key]);

        return $this;
    }

    /**
     * @param      $oldKey
     * @param      $key
     *
     * @param bool $ascending
     *
     * @return $this
     */
    public function replaceSorter($oldKey, $key, $ascending = true)
    {
        $this->removeSorter($oldKey);
        $this->setSorter($key, $ascending);

        return $this;
    }

    /**
     * @return $this
     */
    public function clearSorters()
    {
        $this->sorters = [];

        return $this;
    }

    /**
     * @return int
     */
    public function getLimit()
    {
        return $this->limit;
    }

    /**
     * @return int
     */
    public function getPage()
    {
        return $this->page;
    }

    public function getInitialParameters()
    {
        return $this->initialParameters;
    }

    public function getInitialConditions()
    {
        return $this->initialParameters['conditions'];
    }

    public function getInitialSorters()
    {
        return $this->initialParameters['sorters'];
    }

    public function getInitialLimit()
    {
        return $this->initialParameters['limit'];
    }

    public function getInitialPage()
    {
        return $this->initialParameters['page'];
    }
}