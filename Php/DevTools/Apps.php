<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\DevTools;

use Apps\Webiny\Php\AppManager\App;
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
     * @param string $name
     *
     * @return App|null
     */
    public function getApp($name)
    {
        /* @var $app App */
        foreach ($this->apps as $app) {
            if ($name === $app->getName()) {
                return $app;
            }
        }

        return null;
    }

    public function addApp(App $app)
    {
        $this->apps[] = $app;

        return $this;
    }

    public function getIterator()
    {
        return new \ArrayIterator($this->apps);
    }
}
