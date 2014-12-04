<?php
namespace Webiny\Platform\Tools;

use Webiny\Platform\Tools\Views\SmartyApp;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\TemplateEngine\TemplateEngineTrait;

class TemplateEngine
{
    use SingletonTrait, TemplateEngineTrait, PlatformTrait;

    protected function init()
    {
        $config = $this->getPlatform()->getConfig('TemplateEngine');
        \Webiny\Component\TemplateEngine\TemplateEngine::setConfig($config);
    }

    public function fetch($template, $data = [])
    {
        $data['App'] = SmartyApp::getInstance();

        return $this->templateEngine()->fetch($template, $data);
    }

    public function assign($var, $value)
    {
        $this->templateEngine()->assign($var, $value);
    }
}