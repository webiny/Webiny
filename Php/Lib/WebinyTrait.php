<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib;

use Apps\Webiny\Php\Lib\AppNotifications\AppNotifications;
use Apps\Webiny\Php\Lib\Authorization\Authorization;
use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\I18N\I18N;
use Webiny\AnalyticsDb\AnalyticsDb;
use Webiny\Component\Cache\CacheStorage;
use Webiny\Component\Http\Cookie;
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
     * Get access to AppNotifications
     *
     * @return AppNotifications
     */
    static protected function wAppNotifications()
    {
        return AppNotifications::getInstance();
    }

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
     * Get current cookies
     *
     * @return Cookie
     */
    static protected function wCookie()
    {
        return Cookie::getInstance();
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
     *
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
     * @return TemplateEngine
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
        return self::wConfig()->get('Webiny.EnvironmentType', 'production') == 'production';
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
     * Main use is to make it easier to wrap texts into I18N. Secondary use is if base text was not passed, then this method will return
     * an instance (singleton) of I18N which can then be used to maybe call formatting methods like dates / numbers.
     * @param       $base
     * @param array $variables
     * @param array $options
     *
     * @return string
     * @throws AppException
     */
    static protected function wI18n($base = null, $variables = [], $options = [])
    {
        if (!$base) {
            return I18N::getInstance();
        }

        $options['namespace'] = $options['namespace'] ?? null;
        if (!$options['namespace']) {
            if (!property_exists(static::class, 'i18nNamespace')) {
                throw new AppException('Trying to output I18N text but no namespace defined.', null, [
                    'class' => static::class,
                    'base' => $base
                ]);
            } else {
                $options['namespace'] = static::$i18nNamespace;
            }
        }

        $textKey = $options['namespace'] . '.' . md5($base);
        return I18N::getInstance()->translate($base, $variables, $textKey);
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

    /**
     * Get ApiCache instance.
     *
     * @return ApiCache
     */
    static protected function wApiCache()
    {
        return ApiCache::getInstance();
    }

    /**
     * Get UserProvider instance.
     *
     * @return UserProvider
     */
    static protected function wUser()
    {
        return UserProvider::getInstance();
    }
}
