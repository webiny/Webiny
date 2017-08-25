<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\DevTools;

use Apps\Webiny\Php\DevTools\Exceptions\AppException;
use Apps\Webiny\Php\PackageManager\App;
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

    /**
     * Get App instance
     *
     * @param $name
     *
     * @return App
     * @throws AppException
     */
    public function getApp($name)
    {
        if (!isset($this->apps['Apps/' . $name])) {
            throw new AppException('App "' . $name . '" was not found!', 'WBY-APP_NOT_FOUND');
        }

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
