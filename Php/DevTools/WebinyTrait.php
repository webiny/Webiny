<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools;

use Apps\Core\Php\DevTools\Authorization\Authorization;
use Apps\Core\Php\PackageManager\App;
use Webiny\AnalyticsDb\AnalyticsDb;
use Webiny\Component\Cache\CacheStorage;
use Webiny\Component\Mongo\Mongo;
use Webiny\Component\ServiceManager\ServiceManager;
use Webiny\Component\Storage\Storage as WebinyStorage;
use Webiny\Component\Validation\Validation;

/**
 * This trait provides you with access to all core components.
 */
trait WebinyTrait
{
    /**
     * Get access to AnalyticsDb
     *
     * @return AnalyticsDb
     */
    static protected function wAnalytics()
    {
        return ServiceManager::getInstance()->getService('AnalyticsDb');
    }

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
     * Get Mailer instance
     * @param string $name
     *
     * @return \Webiny\Component\Mailer\Mailer
     */
    static protected function wMailer($name = 'Default')
    {
        return Mailer::getInstance()->getMailer($name);
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
     * @return Validation
     */
    static protected function wValidation()
    {
        return Validation::getInstance();
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
