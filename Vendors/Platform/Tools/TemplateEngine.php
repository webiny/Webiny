<?php
namespace Platform\Tools;

use Platform\Tools\Views\SmartyApp;
use Platform\Traits\AppTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\TemplateEngine\TemplateEngineTrait;

class TemplateEngine
{
    use SingletonTrait, TemplateEngineTrait, AppTrait;

    protected function init()
    {
        $config = $this->getApp()->getConfig('TemplateEngine');
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