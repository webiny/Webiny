<?php
namespace Webiny\Platform\Builders\AssetBuilders;

use Webiny\Component\Storage\File\LocalFile;
use Webiny\Platform\Bootstrap\Module;

class CssBuilder extends AbstractAssetBuilder
{

    public function build()
    {
        $appName = $this->_app->getName();
        $cssPaths = [];
        $modeDir = $this->_mode == self::DEVELOPMENT ? 'Development' : 'Production';
        $buildDirKey = $appName . '/Build/' . $modeDir . '/Css';

        $modifiedModules = 0;

        /* @var $module Module */
        foreach ($this->_app->getModules() as $module) {
            $moduleName = $module->getName();
            $assetsDirKey = $appName . '/' . $moduleName . '/Assets';

            // Generate and check last modified time on listed CSS files
            $cssLastModified = 0;
            $cssFiles = [];
            $moduleCssFiles = $module->getConfig('Assets.Css');

            if (!$moduleCssFiles) {
                continue;
            }

            $this->_log('Checking LESS/CSS files for modifications:');
            foreach ($moduleCssFiles as $cssFile) {
                $cssFile = new LocalFile($assetsDirKey . '/' . $cssFile, $this->_storage);
                $cssLastModified += $cssFile->getTimeModified();
                $cssFiles[] = $cssFile;
            }

            if ($cssLastModified == $this->_log->keyNested('Css.' . $moduleName)) {
                $this->_log('- `' . $moduleName . '` module CSS was not modified.');
                continue;
            }

            $this->_log('- `' . $moduleName . '` module CSS will be built!');
            $modifiedModules++;

            /**
             * Web paths for LESS files (mostly images)
             */
            $productionPath = '/Apps/' . $appName . '/Build/Production/' . $moduleName . '/Assets';
            $developmentPath = '/Apps/' . $appName . '/' . $moduleName . '/Assets';
            $modulePath = $this->_mode == self::PRODUCTION ? $productionPath : $developmentPath;
            $cssPaths[] = '@' . $appName . '_' . $moduleName . ': "' . $modulePath . '";';

            /* @var LocalFile $cssFile */
            foreach ($cssFiles as $cssFile) {
                $cssPaths[] = '@import (less) "' . $cssFile->getKey() . '";';
            }

            $this->_log->keyNested('Css.' . $moduleName, $cssLastModified);
        }

        $this->_log("---------------------------------");
        $this->_log($modifiedModules . " module(s) will be built.");
        $this->_log("---------------------------------");

        if($modifiedModules == 0){
            return;
        }

        $lessFile = new LocalFile($buildDirKey . '/' . $appName . '.less', $this->_storage);
        $lessFile->setContents(join("\n", $cssPaths));
        $lessPath = $lessFile->getAbsolutePath();
        $cssPath = $this->str($lessPath)->replace('.less', '.css')->val();

        $this->_log('Compiling LESS/CSS assets to CSS `'.$cssPath.'`');
        exec('lessc --include-path=' . $this->_storage->getAbsolutePath() . ' ' . $lessPath . ' > ' . $cssPath);
    }
}