<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\PackageManager;

use Apps\Webiny\Php\DevTools\WebinyTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * PackageScanner scans the currently enabled apps.
 */
class AppScanner
{
    use WebinyTrait, SingletonTrait, StdLibTrait;

    /**
     * @var array An array containing a list of enabled apps
     */
    private $apps = [];

    /**
     * Package scanner base constructor.
     */
    protected function init()
    {
        $this->apps = $this->scanApps();
        $this->wApps()->setApps($this->apps);

        // Register routes in Webiny/Router
        $this->wRouter()->compileRoutes();
    }

    private function scanApps()
    {
        // Get list of enabled apps
        $apps = $this->wConfig()->get('Apps')->toArray();

        // Add Webiny app which must always be included in the bootstrap process
        $apps['Webiny'] = true;

        $result = [];
        foreach ($apps as $app => $enabled) {
            if (!$enabled) {
                continue;
            }

            $configPath = 'Apps/' . $app . '/App.yaml';

            // If App - detect version and setup auto-loader
            if ($app !== 'Webiny') {
                $version = '';
                if (!is_bool($enabled)) {
                    $version = '/' . str_replace('.', '_', $enabled);
                }
                $configPath = 'Apps/' . $app . $version . '/App.yaml';
            }

            // parse app info
            $info = $this->wConfig()->parseConfig($configPath);

            // create package instance
            $result['Apps/' . $app] = new App($info, 'Apps/' . $app, 'app');
        }

        return $result;
    }
}