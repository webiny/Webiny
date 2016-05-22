<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\DevTools;

use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\Storage\Directory\Directory;
use Webiny\Component\Storage\Driver\Local\LocalStorageDriver;
use Webiny\Component\Storage\Storage as StorageProvider;
use Webiny\Component\Storage\StorageTrait;

/**
 * Storage class provides us with access to the storage.
 */
class Storage
{
    use SingletonTrait, StorageTrait;

    /**
     * @var StorageProvider
     */
    static private $appRootStorage;

    /**
     * Initializes the storage
     */
    protected function init()
    {
        // get app absolute path
        $configPath = realpath(dirname(__FILE__) . '/../../../../') . '/';

        // init StorageProvider
        self::$appRootStorage = new StorageProvider(new LocalStorageDriver($configPath, ''));
    }

    /**
     * Read the defined directory
     *
     * @param string $dir Path from application root.
     *
     * @return Directory
     */
    public function readDir($dir = '')
    {
        return new Directory($dir, self::$appRootStorage);
    }

    /**
     * Get absolute path based from application root
     *
     * @param string $path Path from application root.
     *
     * @return string
     */
    public function getPath($path)
    {
        return self::$appRootStorage->getAbsolutePath($path);
    }

    public function getStorage($name)
    {
        return $this->storage($name);
    }
}