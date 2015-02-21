<?php
namespace Webiny\Platform\Builders;

use Webiny\Component\Config\ConfigTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\Directory\LocalDirectory;
use Webiny\Platform\Bootstrap\App;
use Webiny\Component\Storage\Storage;
use Webiny\Platform\Bootstrap\Module;

/**
 * @package Builders
 */
final class DevelopmentBuilder
{
    use StdLibTrait, ConfigTrait;

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
        // Get a list of components that need to be built
        $components = [];
        $appName = $app->getName();
        $buildLog = $this->_loadBuildLog($app);
        /* @var $module Module */
        foreach ($app->getModules() as $module) {
            $moduleName = $module->getName();
            $moduleComponentsPath = $app->getName() . '/' . $module->getName() . '/Js/Components';
            $componentsDir = new LocalDirectory($moduleComponentsPath, $this->_storage);
            /* @var $item LocalDirectory */
            foreach ($componentsDir as $item) {
                if (!$item->isDirectory()) {
                    continue;
                }

                $componentDir = $item->getKey();
                $componentName = $this->str($componentDir)->explode('/')->last()->val();
                $componentJsKey = $componentDir . '/' . $componentName . '.js';

                if (!$this->_storage->keyExists($componentJsKey)) {
                    continue;
                }

                $componentPath = $this->_storage->getAbsolutePath($componentDir);
                $componentHtplKey = $componentDir . '/' . $componentName . '.htpl';

                // Check last modified timestamp against the build log
                $lmLog = $buildLog->keyNested('LastModified.' . $moduleName . '.' . $componentName);
                $lmJsDisk = $this->_storage->getTimeModified($componentJsKey);
                $lmHtplDisk = $this->_storage->getTimeModified($componentHtplKey);
                $lmComponent = $lmJsDisk + $lmHtplDisk;

                if ($lmLog && $lmLog >= $lmComponent) {
                    continue;
                }

                // Set new timestamp
                $buildLog->keyNested('LastModified.' . $moduleName . '.' . $componentName, $lmComponent);
                $components[] = [
                    'module'  => $moduleName,
                    'name'    => $componentName,
                    'jsPath'  => $componentPath . '/' . $componentName . '.js',
                    'tplPath' => $componentPath . '/' . $componentName . '.htpl'
                ];
            }
        }

        // Save new build log
        $this->_storage->setContents($appName . '/Build/Development/Log.json', json_encode($buildLog->val()));

        // Parse HTPL and store component in App/BuildTmp folder
        $buildReactDir = $this->_storage->getAbsolutePath($appName . '/BuildTmp/React');
        $buildJsxDir = $this->_storage->getAbsolutePath($appName . '/BuildTmp/Jsx');
        @mkdir($buildReactDir, 0755, true);
        @mkdir($buildJsxDir, 0755, true);
        foreach ($components as $moduleName => $cmp) {
            // Parse HTPL and store JSX
            $parser = new Parser();
            $jsx = $parser->parse(file_get_contents($cmp['tplPath']));

            $jsxTmpPath = $buildJsxDir . '/' . $cmp['module'] . '_' . $cmp['name'] . '.js';
            file_put_contents($jsxTmpPath, $jsx);
        }

        // Transform JSX to React
        exec(__DIR__ . '/External/react-tools/bin/jsx ' . $buildJsxDir . ' ' . $buildReactDir, $output);

        foreach ($components as $cmp) {
            // Optimize JSX
            $react = file_get_contents($buildReactDir . '/' . $cmp['module'] . '_' . $cmp['name'] . '.js');
            $react = str_replace("\n", "", $react);
            $replacements = [
                "/>\s+</" => "><",
                "/>\s+{/" => ">{",
                "/}\s+</" => "}<",
                "/>\s+&/" => ">&",
                "/;\s+</" => ";<"
            ];
            $react = preg_replace(array_keys($replacements), array_values($replacements), $react);

            // Build component
            $js = file_get_contents($cmp['jsPath']);
            $getFqnPos = strpos($js, 'getFqn()');
            $partOne = substr($js, 0, $getFqnPos);
            $partTwo = substr($js, $getFqnPos);

            $getTemplateFn = "getTemplate(){ return " . $react . ";}\n\n\t";

            $buildComponent = $partOne . $getTemplateFn . $partTwo;
            $componentKey = $appName . '/Build/Development/Components/' . $cmp['module'] . '/' . $cmp['name'] . '/' . $cmp['name'] . '.js';
            $this->_storage->setContents($componentKey, $buildComponent);
        }
    }

    /**
     * @param App $app
     *
     * @return array|\Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject
     * @throws \Webiny\Component\Storage\StorageException
     */
    private function _loadBuildLog(App $app)
    {
        $buildLog = $this->arr(['LastModified' => []]);

        $key = $app->getName() . '/Build/Development/Log.json';
        if ($this->_storage->keyExists($key)) {
            $buildLog = $this->config()->json($this->_storage->getAbsolutePath($key))->toArray(true);
        }

        return $buildLog;
    }
}