<?php
namespace Webiny\Core\Traits;

use Webiny\Core\ConfigLoader;
use Webiny\Core\Environment;
use Webiny\Core\Platform;
use Webiny\Core\User;

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
     * @return Environment
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
     * @return ConfigLoader
     */
    protected static function config(){
        return ConfigLoader::getInstance();
    }

    /**
     * Get current user
     * @return false|\Ht\Entities\Admin|\Ht\Entities\User
     */
    protected static function getUser(){
        return User::getInstance()->getUser();
    }
}