<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib;

use Apps\Webiny\Php\Lib\Apps\App;
use Webiny\Component\StdLib\SingletonTrait;

/**
 * Apps class.
 *
 * This class holds all the registered apps and provides methods to easily work with app instances.
 *
 */
class Apps implements \IteratorAggregate
{
    use SingletonTrait;

    private $apps = [];

    /**
     * Load enabled apps
     *
     * @return array Array of app instances
     */
    public function loadApps()
    {
        if (count($this->apps)) {
            return $this->apps;
        }

        // Get list of enabled apps
        $apps = Config::getInstance()->get('Apps')->toArray();

        // Add Webiny app which must always be included in the bootstrap process
        $apps['Webiny'] = true;

        foreach ($apps as $app => $enabled) {
            if (!$enabled) {
                continue;
            }

            try {
                $this->loadApp($app);
            } catch (\Exception $e) {
                continue;
            }
        }

        // Register routes in Webiny/Router component
        Router::getInstance()->compileRoutes();

        return $this->apps;
    }

    /**
     * Load app by name and add its events and services to the system.
     *
     * @param string $app
     *
     * @return App
     */
    public function loadApp($app)
    {
        $existingApp = $this->getApp($app);
        if ($existingApp) {
            return $existingApp;
        }

        $configPath = 'Apps/' . $app . '/App.yaml';
        $config = Config::getInstance()->parseConfig($configPath);
        $newApp = new App($config, 'Apps/' . $app);
        $this->apps[] = $newApp;

        return $newApp;
    }

    /**
     * Get App instance (from currently loaded apps)
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

    /**
     * Enable app by adding it to Configs/Base/Apps.yaml
     *
     * @param string $appName
     */
    public function enableApp($appName)
    {
        $appsYaml = 'Configs/Base/Apps.yaml';
        $appsConfig = Config::getInstance()->parseConfig($appsYaml);
        $appsConfig->set('Apps.' . $appName, true);
        Storage::getInstance()->getStorage('Root')->setContents($appsYaml, $appsConfig->getAsYaml());
    }

    public function getIterator()
    {
        return new \ArrayIterator($this->apps);
    }
}
