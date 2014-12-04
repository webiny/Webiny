<?php
namespace Webiny\Platform\Bootstrap;

use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Component\Config\ConfigTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\Directory\LocalDirectory;
use Webiny\Component\Storage\StorageTrait;

class AppLoader
{
    use PlatformTrait, StorageTrait, StdLibTrait, ConfigTrait;

    private $_loadedApps;

    /**
     * Get all active platform modules
     */
    public function loadApps()
    {
        $this->_loadedApps = $this->arr();

        $appFile = '*App.yaml';
        $appConfigs = new LocalDirectory('', $this->storage('Apps'), 1, $appFile);
        foreach ($appConfigs as $appConfig) {
            $appYamlPath = $appConfig->getAbsolutePath();
            $appConfig = $this->config()->yaml($appYamlPath);
            $app = new App($appConfig, $this->_getModuleDirectory($appYamlPath));
            if($app->isActive()) {
                $app->loadModules();
                $this->_loadedApps->key($app->getName(), $app);
                $this->getPlatform()->getConfig()->mergeWith($appConfig);
            }
        }
    }

    public function getLoadedApps(){
        return $this->_loadedApps;
    }

    private function _getModuleDirectory($appYamlPath)
    {
        return $this->str($appYamlPath)->explode('/')->removeLast()->implode('/')->val();
    }
}