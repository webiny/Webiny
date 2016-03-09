<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\RequestHandlers;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Webiny\Component\EventManager\Event;
use Webiny\Component\Http\Request;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

/**
 * This class is passed to Api event handlers
 */
class ApiEvent extends Event
{
    use DevToolsTrait;

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
}