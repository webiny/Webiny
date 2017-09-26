<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\Apps;

use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\Storage\Directory\Directory;

/**
 * Class that holds information about a JS application.
 */
class JsApp
{
    use WebinyTrait;

    protected $name;
    protected $app;
    protected $directory;

    public function __construct(App $app, Directory $dir)
    {
        $this->app = $app;
        $this->directory = $dir;
        $this->name = str_replace($app->getName() . '/Js/', '', $dir->getKey());
    }

    /**
     * Get JS app name
     *
     * @return string Ex: 'Backend', 'Frontend'
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Get full JS app name
     *
     * @return string Ex: 'Webiny.Backend'
     */
    public function getFullName()
    {
        return $this->app->getName() . '.' . $this->name;
    }

    /**
     * Get Webiny app this JS app belongs to
     *
     * @return App
     */
    public function getApp()
    {
        return $this->app;
    }

    public function getDirectory()
    {
        return $this->directory;
    }

    /**
     * Get absolute path to this JS app build folder
     *
     * @return mixed
     */
    public function getBuildPath()
    {
        if ($this->wIsProduction()) {
            $storage = $this->wStorage('ProductionBuild');
        } else {
            $storage = $this->wStorage('DevelopmentBuild');
        }

        return $storage->getAbsolutePath($this->app->getName() . '_' . $this->name);
    }

    /**
     * Get public path to this JS app build folder (this path is used in browser)
     *
     * @return string
     */
    public function getPublicBuildPath()
    {
        $env = $this->wIsProduction() ? 'production' : 'development';

        return '/build/' . $env . '/' . $this->app->getName() . '_' . $this->name;
    }

    /**
     * Get build meta data (meta.json file contents)
     *
     * @return array
     */
    public function getBuildMeta()
    {
        return json_decode(file_get_contents($this->getAssetPath('meta.json')), true);
    }

    /**
     * Get absolute path to this JS app $asset
     *
     * @param string $asset Relative path to the asset in the build folder
     *
     * @return mixed
     */
    public function getAssetPath($asset)
    {
        return $this->getBuildPath() . '/' . ltrim($asset, '/');
    }

    /**
     * Get public path to this JS app $asset
     *
     * @param string $asset Relative path to the asset in the build folder
     *
     * @return mixed
     */
    public function getPublicAssetPath($asset)
    {
        return $this->getPublicBuildPath() . '/' . ltrim($asset, '/');
    }
}