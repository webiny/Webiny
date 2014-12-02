<?php
namespace Platform\App;

use Platform\Traits\AppTrait;
use Webiny\Component\Config\ConfigTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\Directory\LocalDirectory;
use Webiny\Component\Storage\StorageTrait;

class ModuleLoader
{
    use AppTrait, StorageTrait, StdLibTrait, ConfigTrait;

    private $_loadedModules;

    /**
     * Get all active platform modules
     */
    public function loadModules()
    {
        $this->_loadedModules = $this->arr();

        $moduleFile = '*Module.yaml';
        $moduleConfigs = new LocalDirectory('Modules', $this->storage('Root'), 1, $moduleFile);
        foreach ($moduleConfigs as $moduleConfig) {
            $moduleYamlPath = $moduleConfig->getAbsolutePath();
            $moduleConfig = $this->config()->yaml($moduleYamlPath);
            $module = new Module($moduleConfig, $this->_getModuleDirectory($moduleYamlPath));
            if($module->isActive()) {
                $this->_loadedModules->key($module->getName(), $module);
                $this->getApp()->getConfig()->mergeWith($moduleConfig);
            }
        }
    }

    public function getLoadedModules(){
        return $this->_loadedModules;
    }

    private function _getModuleDirectory($moduleYamlPath)
    {
        return $this->str($moduleYamlPath)->explode('/')->removeLast()->implode('/')->val();
    }
}