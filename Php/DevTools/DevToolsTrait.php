<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\DevTools;

use Apps\Core\Php\DevTools\Validation\ValidationHelper;
use Apps\Core\Php\View\View;
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
     * @return \Webiny\Component\Http\Request
     */
    static protected function wRequest()
    {
        return Request::getInstance()->getRequest();
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
     * @TODO This should return a class that we can use to contact REST services directly from within PHP
     */
    static protected function wService($name)
    {
        ServiceManager::getInstance()->getService($name);
    }

    /**
     * @TODO This should return an instance of EntityAbstract, or some entity in particular.
     */
    static protected function wEntity($entity)
    {
    }

    /**
     * @return \Webiny\Component\TemplateEngine\Bridge\TemplateEngineInterface
     */
    static protected function wTemplateEngine()
    {
        return TemplateEngine::getInstance()->getTemplateEngine();
    }

    static protected function wIsProduction()
    {
        return self::wConfig()->get('Application.Environment', 'production') == 'production';
    }

    static protected function wValidation()
    {
        return ValidationHelper::getInstance();
    }
}
