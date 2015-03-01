<?php
namespace Webiny\Platform\Traits;

use Webiny\Platform\Bootstrap\Module;
use Webiny\Platform\Bootstrap\Platform;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

trait PlatformTrait
{
    /**
     * Get App instance or config by given config key
     *
     * @param null|string $configKey
     *
     * @return Platform|mixed
     */
    protected static function getPlatform($configKey = null)
    {
        if($configKey) {
            return Platform::getInstance()->getConfig($configKey);
        }

        return Platform::getInstance();
    }

    /**
     * Get environment
     *
     * @return \Webiny\Platform\App\Environment
     */
    protected static function getEnvironment()
    {
        return Platform::getInstance()->getEnvironment();
    }

    /**
     * Get all constants or a given constant value
     *
     * @param null|string $key Constant key, can be nested, ex: Server.Integration
     *
     * @return string|\Webiny\Component\Config\ConfigObject
     */
    protected static function getConst($key = null)
    {
        if(!$key) {
            $key = 'Constants';
        } else {
            $key = 'Constants.' . $key;
        }

        return Platform::getInstance()->getConfig($key);
    }

    /**
     * Get current App instance. App is determined by current script namespace.
     * This allows you to access current app instance without hard coding names.
     *
     * @return bool|App
     * @throws StringObjectException
     */
    protected static function getApp(){
        $class = new StringObject(__CLASS__);
        if($class->startsWith('Apps')){
            $appName = $class->explode('\\')[1];
            return self::getPlatform()->getApps($appName);
        }
        return false;
    }

    /**
     * Get current module instance. Module is determined by current script namespace.
     * This allows you to access current module instance without hard coding names.
     *
     * @return bool|Module
     * @throws StringObjectException
     */
    protected static function getModule(){
        $class = new StringObject(__CLASS__);
        if($class->startsWith('Apps')){
            $parts = $class->explode('\\');
            $appName = $parts[1];
            $moduleName = $parts[3];
            return self::getPlatform()->getApps($appName)->getModules($moduleName);
        }
        return false;
    }
}