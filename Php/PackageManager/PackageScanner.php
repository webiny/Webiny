<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\PackageManager;

use Aws\Common\Facade\DataPipeline;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\PackageManager\EventHandlers\PackagesInitialized;

/**
 * PackageScanner scans the current installation and lists information about all installed apps and plugins.
 */
class PackageScanner
{
    use DevToolsTrait, SingletonTrait, StdLibTrait;

    const CACHE_KEY = 'Core.PackageManager.PackageScanner.Packages';

    /**
     * @var array An array containing a list of Package instances.
     */
    private $packages = [];

    /**
     * Package scanner base constructor.
     */
    protected function init()
    {
        $this->packages['apps'] = $this->scanApps('Apps');
        $this->wApps()->setApps($this->packages['apps']);

        // Register routes in Webiny/Router
        $this->wRouter()->compileRoutes();
    }

    static function clearCacheCallback($event)
    {
        // TODO ovo mora ici u EventHandlers
        self::wCache()->delete(self::CACHE_KEY);
    }

    public function listPackages()
    {
        return $this->packages;
    }

    public function getPackage($package)
    {
        return $this->packages[$package]; //check if isset
    }

    private function scanApps($appRoot)
    {
        return $this->_scan($appRoot, "App");
    }

    private function _scan($root, $object)
    {
        $packages = $this->wStorage()->readDir($root);
        $result = [];
        foreach ($packages as $package) {
            $key = $package->getKey();
            $configPath = $key . '/' . $object . '.yaml';

            // If App - detect version and setup autoloader
            $name = $this->str($key)->explode('/')->last()->val();
            if ($object == 'App' && $name !== 'Core') {
                $version = str_replace('.', '_', $this->wConfig()->get($object . 's.' . $name));
                $appPath = $this->wConfig()->get('Application.AbsolutePath') . 'Apps/' . $name . '/' . $version;
                $this->wClassLoader()->appendLibrary('Apps\\' . $name . '\\', $appPath);
                $configPath = $key . '/' . $version . '/' . $object . '.yaml';
            }

            // parse packageinfo
            $info = $this->wConfig()->parseConfig($configPath);

            // create package instance
            $class = '\\Apps\\Core\\Php\\PackageManager\\' . $object;
            $result[$key] = new $class($info, $key, strtolower($object));
        }

        return $result;
    }
}