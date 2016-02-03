<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\DevTools;

use Apps\Core\Php\DevTools\Login\Login;
use Apps\Core\Php\DevTools\Validation\ValidationHelper;
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
     * Get access to database.
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
     * Get access to storage.
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
     * Get access to class loader.
     *
     * @return ClassLoader
     */
    static protected function wClassLoader()
    {
        return ClassLoader::getInstance();
    }

    /**
     * Get access to caching system.
     *
     * @return CacheStorage
     */
    static protected function wCache()
    {
        return Cache::getInstance()->getCache();
    }

    /**
     * Get access to system configuration.
     *
     * @return Config
     */
    static protected function wConfig()
    {
        return Config::getInstance();
    }

    /**
     * Get current request information.
     *
     * @return Request
     */
    static protected function wRequest()
    {
        return Request::getInstance();
    }

    /**
     * Get access to event manager.
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
     * return ServiceManager
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
     * @return \Webiny\Component\TemplateEngine\Bridge\TemplateEngineInterface
     */
    static protected function wTemplateEngine()
    {
        return TemplateEngine::getInstance()->getTemplateEngine();
    }

    /**
     * @return bool
     */
    static protected function wIsProduction()
    {
        return self::wConfig()->get('Application.Environment', 'production') == 'production';
    }

    /**
     * @return ValidationHelper
     */
    static protected function wValidation()
    {
        return ValidationHelper::getInstance();
    }

    /**
     * @return Login
     */
    static protected function wAuth()
    {
        return Login::getInstance();
    }
}
