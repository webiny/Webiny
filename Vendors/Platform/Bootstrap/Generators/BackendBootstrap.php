<?php
namespace Webiny\Platform\Bootstrap\Generators;

use Webiny\Component\Config\ConfigObject;
use Webiny\Component\Config\ConfigTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Platform\Bootstrap\App;
use Webiny\Platform\Bootstrap\Module;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Platform\Traits\TemplateEngineTrait;

class BackendBootstrap
{
    use PlatformTrait, StdLibTrait, TemplateEngineTrait;

    public function generateBootstrapFile()
    {
        $modules = [];
        /* @var App $app */
        foreach ($this->getPlatform()->getApps() as $app) {
            /* @var Module $module */
            foreach ($app->getModules() as $module) {
                $modules[] = [
                    'name'  => $module->getName(),
                    'alias' => $app->getName() . $module->getName() . 'Module',
                    'path'  => '/Apps/' . $app->getName() . '/' . $module->getName() . '/Js/Module'
                ];
            }
        }

        // Main component
        $mc = $this->getPlatform('Platform.Bootstrap');

        $data['WP'] = [
            'Modules'            => $modules,
            'MainComponentAlias' => 'MainComponent',
            'MainComponentPath'  => '/Apps/' . $mc['App'] . '/' . $mc['Module'] . '/Js/Components/' . $mc['Component'] . '/' . $mc['Component']
        ];

        $bootstrapFileTemplate = __DIR__.'/Templates/App.js.tpl';
        $bootstrapSource = $this->templateEngine()->fetch($bootstrapFileTemplate, $data);
        $bootstrapFilePath = $this->getPlatform()->getAbsPath().'/Public/Assets/App.js';
        @unlink($bootstrapFilePath);
        file_put_contents($bootstrapFilePath, $bootstrapSource);
    }

}