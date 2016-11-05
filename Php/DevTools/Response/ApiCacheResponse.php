<?php
namespace Apps\Core\Php\DevTools\Response;

/**
 * Class ApiResponse
 */
class ApiCacheResponse extends ApiResponse
{
    /**
     * Get original data
     *
     * @return string
     */
    public function getData()
    {
        return $this->data;
    }

    
    public function output()
    {
        header("Content-type: application/json");
        header("X-Webiny-Cache: true");
        return $this->data; // the data is already stored in json format in cache, we just need to output it
    }
}