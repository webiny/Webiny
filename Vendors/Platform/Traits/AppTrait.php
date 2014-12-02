<?php
namespace Platform\Traits;

use Platform\App\App;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

trait AppTrait
{
    /**
     * Get App instance or config by given config key
     *
     * @param null|string $configKey
     *
     * @return App|mixed
     */
    protected static function getApp($configKey = null)
    {
        if($configKey) {
            return App::getInstance()->getConfig($configKey);
        }

        return App::getInstance();
    }

    /**
     * Get environment
     *
     * @return \Platform\App\Environment
     */
    protected static function getEnvironment()
    {
        return App::getInstance()->getEnvironment();
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

        return App::getInstance()->getConfig($key);
    }

    /**
     * Get current module instance. Module is determined by current script namespace.
     * This allows you to access current module instance without hard coding what module that is.
     *
     * @return bool|Module
     * @throws StringObjectException
     */
    protected static function getModule(){
        $class = new StringObject(__CLASS__);
        if($class->startsWith('Modules')){
            $moduleName = $class->explode('\\')[1];
            return self::getApp()->getModules($moduleName);
        }
        return false;
    }
}