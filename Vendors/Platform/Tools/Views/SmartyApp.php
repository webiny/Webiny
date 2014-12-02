<?php
namespace Platform\Tools\Views;

use Platform\Traits\AppTrait;
use Webiny\Component\StdLib\SingletonTrait;

class SmartyApp
{
    use SingletonTrait, AppTrait;

    public function getPath($path)
    {
        return $this->getApp()->getModulesPath() . '/' . $path;
    }

    public function getWebPath($path)
    {
        return $this->getApp()->getModulesWebPath() . '/' . $path;
    }

    public function isLocal()
    {
        return $this->getEnvironment()->isLocal();
    }

    public function getConfig($key)
    {
        return $this->getApp($key);
    }
}

 