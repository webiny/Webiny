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
    public function getData()
    {
        return $this->data;
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

        return $this->data; // the data is already stored in json format in cache, we just need to output it
    }
}