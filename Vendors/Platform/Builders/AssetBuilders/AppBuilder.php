<?php
namespace Webiny\Platform\Builders\AssetBuilders;

use Webiny\Component\Storage\File\LocalFile;
use Webiny\Platform\Bootstrap\Module;

class AppBuilder extends AbstractAssetBuilder
{

    public function build()
    {
        $appName = $this->_app->getName();
        $modeDir = $this->_mode == self::DEVELOPMENT ? 'Development' : 'Production';
        $buildDirKey = $appName . '/Build/' . $modeDir;

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
        $appJs = [];
        foreach ($this->_app->getModules() as $module) {
            if ($module->isActive()) {
                $impModuleName = $appName . $module->getName() . 'Module';
                $from = '/Apps/' . $appName . '/' . $module->getName() . '/Js/Module';
                $appJs[] = 'import ' . $impModuleName . ' from \'' . $from . '\'';
                $appJs[] = 'new  ' . $impModuleName . '();';
            }
        }
        $appJsFile = new LocalFile($buildDirKey . '/App.js', $this->_storage);
        $appJsFile->setContents(join("\n", $appJs));
        $this->_log("Created new App.js in `/Apps/" . $appJsFile->getKey() . "`");
    }
}