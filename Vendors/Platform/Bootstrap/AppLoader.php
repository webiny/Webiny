<?php
namespace Webiny\Platform\Bootstrap;

use Webiny\Component\Config\ConfigTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\Directory\LocalDirectory;
use Webiny\Component\Storage\StorageTrait;

class AppLoader
{
    use StorageTrait, StdLibTrait, ConfigTrait;

    /**
     * Get all active platform modules
     *
     * @param bool $backend
     *
     * @return \Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject
     * @throws \Exception
     * @throws \Webiny\Component\ServiceManager\ServiceManagerException
     */
    public function loadApps($backend = false)
    {
        $loadedApps = $this->arr();

        $appFile = '*App.yaml';
        $appConfigs = new LocalDirectory('', $this->storage('Apps'), 1, $appFile);
        foreach ($appConfigs as $appConfig) {
            $appYamlPath = $appConfig->getAbsolutePath();
            $appConfig = $this->config()->yaml($appYamlPath);

            $areaConfigDir = $backend ? 'Backend' : 'Frontend';
            $areaConfigPath = $this->str($appYamlPath)->explode('/')->removeLast()->implode('/');
            $areaConfigPath .= '/'.$areaConfigDir.'/App.yaml';

            if(file_exists($areaConfigPath)){
                $appConfig->mergeWith($this->config()->yaml($areaConfigPath));
            }

            $app = new App($appConfig, $this->_getModuleDirectory($appYamlPath));
            if ($app->isActive()) {
                $app->loadModules($backend);
                $loadedApps->key($app->getName(), $app);
            }
        }

        return $loadedApps;
    }

    private function _getModuleDirectory($appYamlPath)
    {
        return $this->str($appYamlPath)->explode('/')->removeLast()->implode('/')->val();
    }
}