<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\DevTools;

use Webiny\Component\StdLib\SingletonTrait;

/**
 * Provides us with access to class loader.
 */
class ClassLoader
{
    use SingletonTrait;

    /**
     * @var \Webiny\Component\ClassLoader\ClassLoader
     */
    static private $classLoader;

    protected function init()
    {
        self::$classLoader = \Webiny\Component\ClassLoader\ClassLoader::getInstance();
    }

    public function appendLibrary($namespace, $path)
    {
        self::$classLoader->registerMap([$namespace => $path]);
    }
}
