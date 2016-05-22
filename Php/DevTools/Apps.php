<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools;

use Webiny\Component\StdLib\SingletonTrait;

/**
 * Apps class.
 *
 * This class holds all the registered apps
 *
 */
class Apps implements \IteratorAggregate
{
    use SingletonTrait;

    private $apps = [];

    public function getApp($name)
    {
        return $this->apps['Apps/' . $name];
    }

    public function setApps($apps)
    {
        $this->apps = $apps;

        return $this;
    }

    public function getIterator()
    {
        return new \ArrayIterator($this->apps);
    }
}
