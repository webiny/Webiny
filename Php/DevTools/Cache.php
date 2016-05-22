<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\DevTools;

use Webiny\Component\Cache\CacheStorage;
use Webiny\Component\StdLib\SingletonTrait;


/**
 * Class that provides the access to caching system.
 */
class Cache
{
    use SingletonTrait;

    /**
     * @var CacheStorage
     */
    static private $cache;

    /**
     * Initialize the cache.
     *
     * @throws \Exception
     */
    protected function init()
    {
        $cacheDriver = Config::getInstance()->getConfig()->get("Cache.Driver", "BlackHole");
        $cacheParams = Config::getInstance()->getConfig()->get("Cache.Arguments", [], true);

        try {
            self::$cache = call_user_func_array(['\Webiny\Component\Cache\Cache', $cacheDriver], $cacheParams);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Get cache storage instance.
     *
     * @return CacheStorage
     */
    public function getCache()
    {
        return self::$cache;
    }
}