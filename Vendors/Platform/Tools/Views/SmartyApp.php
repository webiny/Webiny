<?php
namespace Webiny\Platform\Tools\Views;

use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Component\StdLib\SingletonTrait;

class SmartyApp
{
    use SingletonTrait, PlatformTrait;

    public function getPath($path)
    {
        return $this->getPlatform()->getAppsPath() . '/' . $path;
    }

    public function getWebPath($path)
    {
        return $this->getPlatform()->getAppsWebPath() . '/' . $path;
    }

    public function isLocal()
    {
        return $this->getEnvironment()->isLocal();
    }

    public function getConfig($key)
    {
        return $this->getPlatform($key);
    }
}

 