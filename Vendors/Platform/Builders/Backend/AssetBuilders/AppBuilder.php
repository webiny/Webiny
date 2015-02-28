<?php
namespace Webiny\Platform\Builders\Backend\AssetBuilders;

use Webiny\Component\Storage\File\LocalFile;
use Webiny\Platform\Bootstrap\Module;

class AppBuilder extends AbstractAssetBuilder
{

    public function build()
    {
        $appName = $this->_app->getName();
        $modeDir = $this->isDevelopment() ? 'Development' : 'Production';
        $buildDirKey = $appName . '/Build/' . $modeDir.'/Backend';

        /* @var $module Module */
        $modules = [];
        foreach ($this->_app->getModules() as $module) {
            if ($module->isActive()) {
                $modules[] = $module->getName();
            }
        }

        $modulesHash = md5(join('', $modules));

        $appModified = $this->_log->key('App');
        if ($this->_storage->keyExists($buildDirKey . '/App.js') && $appModified == $modulesHash) {
            $this->_log("No changes detected, skipping creation of new App.js.");

            return;
        }

        $this->_log->key('App', $modulesHash);

        /**
         * Generate App.js code - should look like this:
         * <code>
         * import CoreLayoutModule from '/Apps/Core/Layout/Js/Module';
         * new CoreLayoutModule();
         * </code>
         */
        $appImportJs = [];
        $appModuleJs = [];
        foreach ($this->_app->getModules() as $module) {
            if ($module->isActive()) {
                $impModuleName = $appName . $module->getName() . 'Module';
                $from = '/Apps/' . $appName . '/Backend/' . $module->getName() . '/Js/Module';
                $appImportJs[] = 'import ' . $impModuleName . ' from \'' . $from . '\';';
                $appModuleJs[] = 'new  ' . $impModuleName . '();';
            }
        }

        $appJsContent = $this->str(file_get_contents(__DIR__.'/Templates/App.js'));
        $appJsContent->replace('/*__IMPORTS__*/', join("\n", $appImportJs));
        $appJsContent->replace('/*__APP__*/', $this->_app->getName());
        $appJsContent->replace('/*__MODULES__*/', join("\n\t\t", $appModuleJs));

        $appJsFile = new LocalFile($buildDirKey . '/App.js', $this->_storage);
        $appJsFile->setContents($appJsContent->val());
        $this->_log("Created new App.js in `/Apps/" . $appJsFile->getKey() . "`");
    }
}