<?php
namespace Webiny\Platform\Bootstrap;

use Webiny\Component\Router\Router;
use Webiny\Component\Router\RouterTrait;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;
use Webiny\Component\StdLib\StdObject\UrlObject\UrlObject;
use Webiny\Component\Storage\Directory\LocalDirectory;
use Webiny\Component\Storage\File\LocalFile;
use Webiny\Component\Storage\StorageTrait;
use Webiny\Platform\Responses\ResponseAbstract;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\Config\ConfigTrait;
use Webiny\Component\StdLib\StdLibTrait;

class App
{
    use PlatformTrait, StdLibTrait, ConfigTrait, StorageTrait, RouterTrait;

    /**
     * @var ConfigObject
     */
    protected $_config;
    protected $_appPath;
    protected $_modules;
    private $_matchedRoute;

    public function __construct(ConfigObject $config, $appPath)
    {
        $this->_config = $config;
        $this->_appPath = $appPath;
    }

    public function getName()
    {
        return $this->_config->get('App.Name');
    }

    public function getConfig()
    {
        return $this->_config;
    }

    public function isActive()
    {
        return $this->_config->get('App.Active', false);
    }

    public function getAbsolutePath()
    {
        return $this->_appPath;
    }

    /**
     * Get all active App modules for given area
     *
     * @param bool $backend
     *
     * @throws \Exception
     * @throws \Webiny\Component\Config\ConfigException
     * @throws \Webiny\Component\ServiceManager\ServiceManagerException
     */
    public function loadModules($backend = false)
    {
        $this->_modules = $this->arr();
        $area = $backend ? 'Backend' : 'Frontend';

        $moduleFile = '*Module.yaml';
        $modulesDir = 'Apps/' . $this->getName() . '/' . $area;
        if(!$this->storage('Root')->keyExists($modulesDir)){
            return;
        }
        $moduleConfigs = new LocalDirectory($modulesDir, $this->storage('Root'), 1, $moduleFile);
        /* @var LocalFile $moduleConfig */
        foreach ($moduleConfigs as $moduleConfig) {
            $moduleYamlPath = $moduleConfig->getAbsolutePath();
            $moduleConfig = $this->config()->yaml($moduleYamlPath);
            $module = new Module($moduleConfig, $this->_getModuleDirectory($moduleYamlPath));
            if ($module->isActive()) {
                $this->_modules->key($module->getName(), $module);
                $this->_config->mergeWith($moduleConfig);
            }
        }
    }

    public function canRoute(UrlObject $request)
    {
        Router::getInstance()->appendRoutes($this->_config->get('Routes', new ConfigObject([])));

        $this->_matchedRoute = $this->router()->match($request);

        if ($this->_matchedRoute) {
            return true;
        }

        return false;
    }

    /**
     * Run matched route (PHP)
     *
     * @throws \Webiny\Component\Router\RouterException
     * @return ResponseAbstract
     */
    public function run()
    {
        return $this->router()->execute($this->_matchedRoute);
    }

    /**
     * Get modules or module specified by $name
     *
     * @param null|string $name
     *
     * @return bool|Module|ArrayObject
     */
    public function getModules($name = null)
    {
        if (!$name) {
            return $this->_modules;
        }

        return $this->_modules->key($name, false, true);
    }

    private function _getModuleDirectory($moduleYamlPath)
    {
        return $this->str($moduleYamlPath)->explode('/')->removeLast()->implode('/')->val();
    }
}