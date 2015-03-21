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
        $apps = [];
        $assets = [
            'css' => [],
            'js'  => []
        ];

        $projectRoot = $this->getPlatform()->getAbsPath();

        /* @var App $app */
        $mode = $this->getPlatform()->getEnvironment()->isDevelopment() ? 'Development' : 'Production';
        foreach ($this->getPlatform()->getApps() as $app) {
            $apps[$app->getName()] = [
                'name' => $app->getName(),
                'path' => '/Apps/' . $app->getName() . '/Build/' . $mode . '/Backend/App.js'
            ];

            $css = '/Apps/' . $app->getName() . '/Build/' . $mode . '/Backend/Css/' . $app->getName() . '.min.css';
            $js = '/Apps/' . $app->getName() . '/Build/' . $mode . '/Backend/Js/' . $app->getName() . '.min.js';

            if (file_exists($projectRoot . $css)) {
                $assets['css'][] = $css;
            }

            if (file_exists($projectRoot . $js)) {
                $assets['js'][] = $js;
            }
        }

        // Main component
        $mc = $this->getPlatform('Platform.Bootstrap');

        $data['WP'] = [
            'Apps'              => $apps,
            'MainComponent'     => 'MainComponent',
            'MainComponentPath' => '/Apps/' . $mc['App'] . '/' . $mc['Module'] . '/Js/Components/' . $mc['Component'] . '/' . $mc['Component']
        ];
        
        $bootstrapFileTemplate = __DIR__ . '/Templates/App.js.php';
        $bootstrapSource = $this->templateEngine()->fetch($bootstrapFileTemplate, $data);
        $bootstrapFilePath = $this->getPlatform()->getAbsPath() . '/Public/Assets/App.js';
        @unlink($bootstrapFilePath);
        file_put_contents($bootstrapFilePath, $bootstrapSource);

        return $assets;
    }

}