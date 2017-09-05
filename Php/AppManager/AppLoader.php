<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\AppManager;

use Apps\Webiny\Php\DevTools\WebinyTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * PackageScanner scans the currently enabled apps.
 */
class AppLoader
{
    use WebinyTrait, SingletonTrait, StdLibTrait;

    /**
     * @var array An array containing a list of enabled apps
     */
    private $apps = [];

    /**
     * Load enabled apps
     * @return array Array of app instances
     */
    public function loadApps()
    {
        // Get list of enabled apps
        $apps = $this->wConfig()->get('Apps')->toArray();

        // Add Webiny app which must always be included in the bootstrap process
        $apps['Webiny'] = true;

        foreach ($apps as $app => $enabled) {
            if (!$enabled) {
                continue;
            }

            $this->loadApp($app);
        }

        // Register routes in Webiny/Router
        $this->wRouter()->compileRoutes();

        return $this->apps;
    }

    /**
     * Load app by name.<br/>
     * The app is added to `wApps()` container and its events and services are added into the system.
     *
     * @param string $app
     *
     * @return App
     */
    public function loadApp($app)
    {
        $existingApp = $this->wApps()->getApp($app);
        if ($existingApp) {
            return $existingApp;
        }

        $configPath = 'Apps/' . $app . '/App.yaml';

        // parse app config
        $config = $this->wConfig()->parseConfig($configPath);

        // create app instance and register in wApps() container
        $newApp = new App($config, 'Apps/' . $app);
        $this->wApps()->addApp($newApp);

        return $newApp;
    }
}