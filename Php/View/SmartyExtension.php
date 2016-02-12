<?php
namespace Apps\Core\Php\View;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\Services\Apps;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\TemplateEngine\Drivers\Smarty\SmartyExtensionAbstract;
use Webiny\Component\TemplateEngine\Drivers\Smarty\SmartySimplePlugin;

setlocale(LC_MONETARY, 'en_GB.UTF-8');

class SmartyExtension extends SmartyExtensionAbstract
{
    use DevToolsTrait, StdLibTrait;

    function getFunctions()
    {
        return [
            new SmartySimplePlugin('webiny', 'function', [$this, 'webinyInclude']),
        ];
    }

    /**
     * Returns the name of the plugin.
     *
     * @return string
     */
    function getName()
    {
        return 'webiny_extension';
    }

    public function webinyInclude($params, $smarty)
    {
        $env = $this->wConfig()->get('Application.Environment', 'production');
        $apps = new Apps();
        $meta = $apps->getAppsMeta('Core.Webiny');
        $cssPath = '';
        $jsPath = '';

        foreach($meta['assets']['js'] as $file){
            if($this->str($file)->contains('/vendors')){
                $jsPath = $file;
            }
        }

        foreach($meta['assets']['css'] as $file){
            if($this->str($file)->contains('/vendors')){
                $cssPath = $file;
            }
        }

        return join("\n    ", [
            '<link href="' . $cssPath . '" rel="stylesheet" type="text/css">',
            '<script src="' . $jsPath . '" type="text/javascript"></script>',
            '<script>var WebinyEnvironment = \'' . $env . '\';</script>'
        ]);
    }
}