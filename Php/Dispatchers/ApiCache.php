<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Dispatchers;

use Apps\Webiny\Php\DevTools\ApiCache\ApiCacheCallback;
use Apps\Webiny\Php\DevTools\Response\ApiCacheResponse;
use Apps\Webiny\Php\RequestHandlers\ApiEvent;
use Webiny\Component\Config\ConfigObject;
use Webiny\Hrc\Hrc;

/**
 * Class ApiCache
 *
 * Api cache listens on Webiny.Api.Before and Webiny.Api.After events.
 * The first it to check if we have the response cached, and if we do, we deliver that response directly from cache.
 * In case the response is not cached, on the After event, we store the response, if it matches any of the defined cache rules.
 *
 * @link: https://github.com/Webiny/Hrc/
 *
 * @package Apps\Webiny\Php\Dispatchers
 */
class ApiCache extends AbstractApiDispatcher
{
    /**
     * @var Hrc
     */
    private $hrc;
    private $cacheStatus = false;

    public function __construct()
    {
        // check if Cache.ApiCache is defined
        $this->cacheStatus = $this->wConfig()->get('ApiCache.Status', false);
        if (!$this->cacheStatus) {
            return;
        }

        // check that it's only a GET request
        if ($this->wRequest()->getRequestMethod() != 'GET') {
            $this->cacheStatus = false;

            return;
        }

        // extract cache rules
        $cacheRules = $this->wConfig()->get('ApiCache.CacheRules', new ConfigObject())->toArray();
        if (!is_array($cacheRules) || count($cacheRules) < 1) {
            $this->cacheStatus = false;

            return;
        }

        /**
         * @var Hrc
         */
        $this->hrc = $this->wService('Hrc');
        $this->hrc->setCacheRules($cacheRules);

        // check if the callback is defined
        $callback = $this->wConfig()->get('ApiCache.Callback', false);
        if ($callback) {
            $this->hrc->registerCallback(new $callback);
        }

        // register core callback
        $this->hrc->registerCallback(new ApiCacheCallback());
    }

    public function cacheRead(ApiEvent $event)
    {
        if (!$this->cacheStatus) {
            return false;
        }

        // we need to flush the current HRC request because of the aggregated API requests
        $this->hrc->flushRequest();

        // read cache
        $response = $this->hrc->read('response');
        if ($response !== false) {
            $response = new ApiCacheResponse($response);
            // get matched rule
            $matchedRule = $this->hrc->getMatchedRule();
            $cacheRule = $this->wConfig()->get('ApiCache.CacheRules.' . $matchedRule->getCacheRule()->getName());
            // check if browser cache is turned on
            if ($cacheRule->get('BrowserCache', false)) {
                // get the remaining ttl
                $remainingTtl = $this->hrc->getRemainingTtl();
                if ($remainingTtl > 0) {
                    $response->setCacheControl($remainingTtl);
                }
            }
            $event->setResponse($response);
        }
    }

    public function cacheSave(ApiEvent $event)
    {
        if (!$this->cacheStatus) {
            return false;
        }
        $response = $event->getResponse();
        // we only cache 200 response code
        if ($response->getStatusCode() != 200) {
            return false;
        }
        // extract the data
        $data = $response->getData(false);
        // save cache
        $this->hrc->save('response', json_encode(['data' => $data]));
    }

}