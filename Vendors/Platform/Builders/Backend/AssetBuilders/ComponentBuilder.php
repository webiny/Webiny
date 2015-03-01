<?php
namespace Webiny\Platform\Builders\Backend\AssetBuilders;

use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;
use Webiny\Component\Storage\Directory\LocalDirectory;
use Webiny\Component\Storage\Storage;
use Webiny\Platform\Bootstrap\App;
use Webiny\Platform\Bootstrap\Module;
use Webiny\Platform\Builders\Backend\Parser;

class ComponentBuilder extends AbstractAssetBuilder
{

    public function __construct(App $app, Storage $storage, ArrayObject $log)
    {
        parent::__construct($app, $storage, $log);

        if (!$log->keyExists('Components')) {
            $this->_log['Components'] = [];
        }
    }


    public function build()
    {
        // Get a list of components that need to be built
        $components = [];
        $appName = $this->_app->getName();

        $this->_log("Checking for component modifications:");
        /* @var $module Module */
        foreach ($this->_app->getModules() as $module) {
            $moduleName = $module->getName();
            $moduleComponentsPath = $this->_app->getName() . '/Backend/' . $module->getName() . '/Js/Components';
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
                $lmLog = $this->_log->keyNested('Components.' . $moduleName . '.' . $componentName);
                $lmJsDisk = $this->_storage->getTimeModified($componentJsKey);
                $lmHtplDisk = $this->_storage->getTimeModified($componentHtplKey);
                $lmComponent = $lmJsDisk + $lmHtplDisk;

                if ($lmLog && $lmLog >= $lmComponent) {
                    $this->_log("- `" . $componentName . "` was not modified.");
                    continue;
                }

                $this->_log("+ `" . $componentName . "` will be built!");

                // Set new timestamp
                $this->_log->keyNested('Components.' . $moduleName . '.' . $componentName, $lmComponent);
                $components[] = [
                    'module'  => $moduleName,
                    'name'    => $componentName,
                    'jsPath'  => $componentPath . '/' . $componentName . '.js',
                    'tplPath' => $componentPath . '/' . $componentName . '.htpl'
                ];
            }
        }

        // Parse HTPL and store component in App/BuildTmp folder
        $modeDir = $this->isDevelopment() ? 'Development' : 'Production';
        $buildReactDir = $this->_storage->getAbsolutePath($appName . '/Build/' . $modeDir . '/Backend/Tmp/React');
        $buildJsxDir = $this->_storage->getAbsolutePath($appName . '/Build/' . $modeDir . '/Backend/Tmp/Jsx');
        // Prepare folders
        exec("rm -rf {$buildJsxDir}");
        exec("rm -rf {$buildReactDir}");
        @mkdir($buildReactDir, 0755, true);
        @mkdir($buildJsxDir, 0755, true);
        $this->_log("---------------------------------");
        $this->_log(count($components) . " component(s) will be built.");
        $this->_log("---------------------------------");
        $this->_log("Running parsers to create valid JSX...");
        foreach ($components as $moduleName => $cmp) {
            // Parse HTPL and store JSX
            $parser = new Parser($this->isDevelopment());
            $jsx = $parser->parse(file_get_contents($cmp['tplPath']));

            $jsxTmpPath = $buildJsxDir . '/' . $cmp['module'] . '_' . $cmp['name'] . '.js';
            file_put_contents($jsxTmpPath, $jsx);
        }

        // Transform JSX to React
        $this->_log("Running JSX -> React transformer...\n");
        exec(__DIR__ . '/../../External/react-tools/bin/jsx --no-cache-dir ' . $buildJsxDir . ' ' . $buildReactDir);

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

            if($getFqnPos === false){
                $this->_log("\nERROR: Component `".$cmp['name']. "` in module `".$cmp['module']. "` is missing a getFqn() method and therefore can not be built!\n", "red");
                die();
            }

            $partOne = substr($js, 0, $getFqnPos);
            $partTwo = substr($js, $getFqnPos);

            $getTemplateFn = "getTemplate(){ return " . $react . ";}\n\n\t";

            $buildComponent = $partOne . $getTemplateFn . $partTwo;
            $componentKey = $appName . '/Build/' . $modeDir . '/Backend/Components/' . $cmp['module'] . '/' . $cmp['name'] . '.js';
            $this->_storage->setContents($componentKey, $buildComponent);
        }
    }
}