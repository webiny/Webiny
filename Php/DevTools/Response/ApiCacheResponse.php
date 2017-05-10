<?php

namespace Apps\Core\Php\DevTools\Response;

use Webiny\Component\Http\Response\CacheControl;
use Webiny\Component\StdLib\StdObjectTrait;

/**
 * Class ApiResponse
 */
class ApiCacheResponse extends ApiResponse
{
    use StdObjectTrait;

    /**
     * @var CacheControl
     */
    protected $cacheControl;

    /**
     * Get original data
     *
     * @return string
     */
    public function getData($format = false)
    {
        if (!$format) {
            return $this->data;
        } else {
            // this is in case of an aggregated query we need to return an array
            $data = json_decode($this->data, true);
            $data['cache'] = true;

            return $data;
        }
    }

    public function setCacheControl($maxAge)
    {
        $expiration = $this->datetime('now', 'GMT');
        $expiration->add($maxAge . ' seconds');

        $this->cacheControl = new CacheControl();
        $this->cacheControl->setAsCache($expiration);
    }

    public function getCacheControlHeaders()
    {
        if (is_null($this->cacheControl)) {
            return parent::getCacheControlHeaders();
        }

        return $this->cacheControl->getCacheControl();
    }

    public function output()
    {
        header('Content-Type: application/json');
        header('X-Webiny-Cache: true');

        return $this->data;
    }
}