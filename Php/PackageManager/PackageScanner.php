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
        // see if we have already all the packages, events and routes in cache
        $data = $this->wCache()->read(self::CACHE_KEY);
        if ($data) {
            ##############
            # FROM CACHE #
            ##############

            // unpack cache
            $packageData = $this->unserialize($data);

            // register packages
            $this->packages = $packageData['packages'];

            // register events
            $this->wEvents()->setListeners($packageData['events']);

            // register routes
            $this->wRouter()->setRoutes($packageData['routes']);

            unset($packageData);
        } else {
            ##################
            # NOT FROM CACHE #
            ##################

            // scan Apps folder
            $this->packages['apps'] = $this->scanApps('Apps');

            // scan Plugins folder
            //$this->packages['plugins'] = $this->scanPlugins('Plugins');

            // scan Themes folder
            //$this->packages['themes'] = $this->scanThemes('Themes');

            // store the packages, events and routes in cache
            /* $packageData = [
                 'packages'  => $this->packages,
                 'events'    => $this->wEvents()->getListeners(),
                 'routes'    => $this->wRouter()->getRoutes()
             ];
             $this->wCache()->save(self::CACHE_KEY, $packageData, (30 * 60));*/
            unset($packageData);
        }
    }

    static function clearCacheCallback($event)
    {
        //@TODO ovo mora ici u EventHandlers
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

    private function scanPlugins($pluginsRoot)
    {
        return $this->_scan($pluginsRoot, "Plugin");
    }

    private function scanThemes($themesRoot)
    {
        return $this->_scan($themesRoot, "Theme");
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
                $version = $this->wConfig()->get($object . 's.' . $name);
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