<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib;

use Apps\Webiny\Php\Lib\ApiCache\ApiCacheCallback;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\ServiceManager\ServiceManager;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Hrc\Hrc;


/**
 * Class that provides the access to caching system.
 */
class ApiCache
{
    use SingletonTrait;

    /**
     * @var Hrc
     */
    static private $hrc;

    /**
     * Initialize the HRC cache.
     *
     * @throws \Exception
     */
    protected function init()
    {
        try {
            /**
             * @var Hrc
             */
            self::$hrc = ServiceManager::getInstance()->getService('Hrc');

            // extract cache rules
            $cacheRules = Config::getInstance()->getConfig()->get('ApiCache.CacheRules', new ConfigObject())->toArray();
            if (is_array($cacheRules)) {
                self::$hrc->setCacheRules($cacheRules);
            }

            // check if the callback is defined
            $callback = Config::getInstance()->getConfig()->get('ApiCache.Callback', false);
            if ($callback) {
                self::$hrc->registerCallback(new $callback);
            }

            // register core callback
            self::$hrc->registerCallback(new ApiCacheCallback());

        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Get Hrc instance.
     *
     * @return Hrc
     */
    public function hrc()
    {
        return self::$hrc;
    }
}