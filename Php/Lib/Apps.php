<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib;

use Apps\Webiny\Php\Lib\Apps\App;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\Storage\Directory\Directory;
use Webiny\Component\Storage\File\File;

/**
 * Apps class.
 *
 * This class holds all the registered apps and provides methods to easily work with app instances.
 *
 */
class Apps implements \IteratorAggregate
{
    use WebinyTrait, SingletonTrait;

    private $apps = [];

    /**
     * Load enabled apps (registers namespace, services, routes, etc.)
     *
     * @return array Array of app instances
     */
    public function loadApps()
    {
        if (count($this->apps)) {
            return $this->apps;
        }

        // Get list of enabled apps
        $apps = Config::getInstance()->get('Apps');
        $apps = $apps instanceof ConfigObject ? $apps->toArray() : [];

        // Add Webiny app which must always be included in the bootstrap process
        $apps['Webiny'] = true;

        foreach ($apps as $app => $enabled) {
            if (!$enabled) {
                continue;
            }

            $this->loadApp($app);
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

        $projectRoot = $this->wConfig()->get('Application.AbsolutePath');
        $configPath = 'Apps/' . $app . '/App.yaml';
        if (!file_exists($projectRoot . '/' . $configPath)) {
            return null;
        }
        $config = $this->wConfig()->yaml($configPath);

        // Check if App.php file exists
        $appClass = App::class;
        $appFile = $projectRoot . '/Apps/' . $app . '/Php/App.php';
        if (file_exists($appFile)) {
            $appClass = 'Apps\\' . $app . '\\Php\\App';
            // We need to manually include the file since autoloader mapping is not yet registered
            include $appFile;
        }
        $newApp = new $appClass($config, 'Apps/' . $app);
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
     * The app itself is not loaded.
     *
     * @param string $appName
     */
    public function enableApp($appName)
    {
        $appsYaml = 'Configs/Base/Apps.yaml';
        $appsConfig = Config::getInstance()->yaml($appsYaml);
        $appsConfig->set('Apps.' . $appName, true);
        Storage::getInstance()->getStorage('Root')->setContents($appsYaml, $appsConfig->getAsYaml());
    }

    /**
     * Get array of configs for all installed apps.
     * The array contains both enabled and disabled apps.
     * The apps are not instantiated, only App.yaml file is read.
     *
     * @return ConfigObject[] Array of ConfigObjects of each installed app
     */
    public function getInstalledApps()
    {
        $apps = [];
        $storage = $this->wStorage('Apps');
        $directory = new Directory('', $storage, 2, '*App.yaml');
        /* @var $file File */
        foreach ($directory as $file) {
            $config = $this->wConfig()->yaml($file->getAbsolutePath());
            $apps[$config['Name']] = $config;
        }

        return $apps;
    }

    public function getIterator()
    {
        return new \ArrayIterator($this->apps);
    }
}
