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
 * This class is used to pass request data to Api event handlers
 */
class ApiEvent extends Event
{
    use DevToolsTrait;

    /**
     * @var Request
     */
    protected $request;

    public function __construct(Request $request)
    {
        parent::__construct();
        $this->request = $request;
    }

    /**
     * @return Request
     */
    public function getRequest()
    {
        return $this->request;
    }

    /**
     * @return StringObject
     * @throws \Webiny\Component\StdLib\StdObject\StringObject\StringObjectException
     */
    public function getUrl(){
        $url = $this->request->getCurrentUrl(true)->setPort('')->val();
        $apiPath = $this->wConfig()->getConfig()->get('Application.ApiPath');
        return $this->str($url)->replace($apiPath, '')->explode('?')->first();
    }
}