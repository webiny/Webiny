<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\DevTools;

use Apps\Core\Php\DevTools\Authorization\Authorization;
use Apps\Core\Php\DevTools\Validation\ValidationHelper;
use Apps\Core\Php\PackageManager\App;
use Webiny\Component\Cache\CacheStorage;
use Webiny\Component\Mongo\Mongo;
use Webiny\Component\ServiceManager\ServiceManager;
use Webiny\Component\Storage\Storage as WebinyStorage;

/**
 * This trait provides you with access to all core components.
 */
trait DevToolsTrait
{
    /**
     * Get access to database
     *
     * @param string $database Name of the database
     *
     * @return Mongo
     */
    static protected function wDatabase($database = 'Webiny')
    {
        return ServiceManager::getInstance()->getService('Mongo.' . $database);
    }

    /**
     * Get access to storage
     *
     * @param null $name
     *
     * @return Storage|WebinyStorage
     */
    static protected function wStorage($name = null)
    {
        if (!$name) {
            return Storage::getInstance();
        }

        return Storage::getInstance()->getStorage($name);
    }

    /**
     * Get access to class loader
     *
     * @return ClassLoader
     */
    static protected function wClassLoader()
    {
        return ClassLoader::getInstance();
    }

    /**
     * Get access to caching system
     *
     * @return CacheStorage
     */
    static protected function wCache()
    {
        return Cache::getInstance()->getCache();
    }

    /**
     * Get access to system configuration
     *
     * @return Config
     */
    static protected function wConfig()
    {
        return Config::getInstance();
    }

    /**
     * Get current request
     *
     * @return Request
     */
    static protected function wRequest()
    {
        return Request::getInstance();
    }

    /**
     * Get access to event manager
     *
     * @return Events
     */
    static protected function wEvents()
    {
        return Events::getInstance();
    }

    /**
     * @return Router
     */
    static protected function wRouter()
    {
        return Router::getInstance();
    }

    /**
     * Get ServiceManager
     *
     * @param null $name
     *
     * @return object|ServiceManager
     * @throws \Webiny\Component\ServiceManager\ServiceManagerException
     */
    static protected function wService($name = null)
    {
        $sm = ServiceManager::getInstance();
        if ($name) {
            return $sm->getService($name);
        }

        return $sm;
    }

    /**
     * Get template engine
     *
     * @return \Webiny\Component\TemplateEngine\Bridge\TemplateEngineInterface
     */
    static protected function wTemplateEngine()
    {
        return TemplateEngine::getInstance();
    }

    /**
     * @return bool
     */
    static protected function wIsProduction()
    {
        return self::wConfig()->get('Application.Environment', 'production') == 'production';
    }

    /**
     * Get Validation
     *
     * @return ValidationHelper
     */
    static protected function wValidation()
    {
        return ValidationHelper::getInstance();
    }

    /**
     * Get Authorization
     *
     * @return Authorization
     */
    static protected function wAuth()
    {
        return Authorization::getInstance();
    }

    /**
     * Get Apps container or App instance
     *
     * @param null|string $app
     *
     * @return Apps|App
     */
    static protected function wApps($app = null)
    {
        if ($app) {
            return Apps::getInstance()->getApp($app);
        }

        return Apps::getInstance();
    }
}
