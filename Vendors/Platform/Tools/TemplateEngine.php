<?php
namespace Webiny\Platform\Tools;

use Webiny\Platform\Tools\Views\SmartyApp;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\TemplateEngine\TemplateEngineTrait;

class TemplateEngine
{
    use SingletonTrait, TemplateEngineTrait, PlatformTrait;

    public function fetch($template, $data = [])
    {
        $data['App'] = SmartyApp::getInstance();
        ob_start();
        include $template;
        $html = ob_get_contents();
        ob_end_clean();
        return $html;
    }
}