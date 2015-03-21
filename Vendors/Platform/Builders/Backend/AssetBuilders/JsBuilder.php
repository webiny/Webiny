<?php
namespace Webiny\Platform\Builders\Backend\AssetBuilders;

use Webiny\Component\Storage\File\LocalFile;
use Webiny\Platform\Bootstrap\Module;

class JsBuilder extends AbstractAssetBuilder
{

    public function build()
    {
        $appName = $this->_app->getName();
        $jsPaths = [];
        $modeDir = $this->isDevelopment() ? 'Development' : 'Production';
        $buildDirKey = $appName . '/Build/' . $modeDir . '/Backend/Js';

        $modifiedModules = 0;

        /* @var $module Module */
        foreach ($this->_app->getModules() as $module) {
            $moduleName = $module->getName();
            $assetsDirKey = $appName . '/Backend/' . $moduleName . '/Assets';

            // Generate and check last modified time on listed JS files
            $jsLastModified = 0;
            $moduleJsFiles = $module->getConfig('Assets.Js');

            if (!$moduleJsFiles) {
                continue;
            }

            $this->_log('Checking JS files for modifications:');
            foreach ($moduleJsFiles as $jsFile) {
                $jsFile = new LocalFile($assetsDirKey . '/' . $jsFile, $this->_storage);
                $jsLastModified += $jsFile->getTimeModified();
                $jsPaths[] = $jsFile->getAbsolutePath();
            }

            if ($jsLastModified == $this->_log->keyNested('Js.' . $moduleName)) {
                $this->_log('- `' . $moduleName . '` module JS was not modified.');
                continue;
            }

            $this->_log('+ `' . $moduleName . '` module JS will be built!');
            $modifiedModules++;
            $this->_log->keyNested('Js.' . $moduleName, $jsLastModified);
        }

        $this->_log("---------------------------------");
        $this->_log($modifiedModules . " module(s) JS will be built.");
        $this->_log("---------------------------------");

        if($modifiedModules == 0){
            return;
        }

        $jsPath = new LocalFile($buildDirKey . '/' . $appName . '.min.js', $this->_storage);
        $jsPath->setContents('');

        $this->_log('Minifying JS assets to `/Apps/'.$jsPath->getKey().'`');
        exec(__DIR__ . '/../../External/node_modules/uglify-js/bin/uglifyjs ' . join(' ', $jsPaths) . ' -o ' . $jsPath->getAbsolutePath());
    }
}