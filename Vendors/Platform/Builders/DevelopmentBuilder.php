<?php
namespace Webiny\Platform\Builders;

use Webiny\Component\Config\ConfigObject;
use Webiny\Component\Config\ConfigTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Platform\Bootstrap\App;
use Webiny\Component\Storage\Storage;
use Webiny\Platform\Builders\AssetBuilders\AppBuilder;
use Webiny\Platform\Builders\AssetBuilders\ComponentBuilder;
use Webiny\Platform\Builders\AssetBuilders\CssBuilder;

/**
 * @package Builders
 */
final class DevelopmentBuilder
{
    use StdLibTrait, ConfigTrait, CliLoggerTrait;

    protected $_config;

    /**
     * @var Storage
     */
    private $_storage;

    public function setAppsStorage(Storage $storage)
    {
        $this->_storage = $storage;

        return $this;
    }

    public function buildApp(App $app)
    {
        $start = microtime(true);
        $this->_log("\nDevelopment build for app `".$app->getName()."` started!");
        $buildLog = $this->_loadBuildLog($app);

        // Build components
        $this->_log("\n1. Building JS Components...");
        $componentBuilder = new ComponentBuilder($app, $this->_storage, $buildLog);
        $componentBuilder->setDevelopmentMode()->build();

        // Build CSS
        $this->_log("\n2. Building CSS...");
        $cssBuilder = new CssBuilder($app, $this->_storage, $buildLog);
        $cssBuilder->setDevelopmentMode()->build();

        // Build App.js
        $this->_log("\n3. Building App.js...");
        $appBuilder = new AppBuilder($app, $this->_storage, $buildLog);
        $appBuilder->build();

        // Save new build log
        $buildDuration = round(microtime(true) - $start, 2);
        $this->_log("\nBuild completed in ".$buildDuration. " second(s)");
        $this->_storage->setContents($app->getName() . '/Build/Development/Log.json', json_encode($buildLog->val()));
    }

    /**
     * @param App $app
     *
     * @return array|\Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject
     * @throws \Webiny\Component\Storage\StorageException
     */
    private function _loadBuildLog(App $app)
    {
        $buildLog = $this->arr();

        $key = $app->getName() . '/Build/Development/Log.json';
        if ($this->_storage->keyExists($key)) {
            $buildLog = $this->config()->json($this->_storage->getAbsolutePath($key))->toArray(true);
        }

        return $buildLog;
    }
}