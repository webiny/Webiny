<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\RequestHandlers;

use Apps\Webiny\Php\DevTools\Response\ApiResponse;
use Apps\Webiny\Php\DevTools\WebinyTrait;
use Webiny\Component\EventManager\Event;
use Webiny\Component\Http\Request;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

/**
 * This class is passed to Api event handlers
 */
class ApiEvent extends Event
{
    use WebinyTrait;

    /**
     * @var ApiResponse
     */
    protected $response = null;

    /**
     * Get URL part of the string relevant to API
     *
     * This method returns the URL part after the API part of the URL:
     * If request is `http://domain.com/api/some-url`, will return `/some-url`
     *
     * @return StringObject
     * @throws \Webiny\Component\StdLib\StdObject\StringObject\StringObjectException
     */
    public function getUrl(){
        $url = $this->wRequest()->getCurrentUrl(true)->val();
        $apiPath = $this->wConfig()->getConfig()->get('Application.ApiPath');
        return $this->str($url)->replace($apiPath, '')->explode('?')->first();
    }

    /**
     * Set response object
     * @param ApiResponse $response
     *
     * @return $this
     */
    public function setResponse(ApiResponse $response = null){
        $this->response = $response;
        return $this;
    }

    /**
     * Get response object
     * @return ApiResponse
     */
    public function getResponse()
    {
        return $this->response;
    }
}