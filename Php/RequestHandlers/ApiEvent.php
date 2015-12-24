<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\RequestHandlers;

use Webiny\Component\EventManager\Event;
use Webiny\Component\StdLib\StdObject\UrlObject\UrlObject;

/**
 * This class is used to pass request data to Api event handlers
 */
class ApiEvent extends Event
{
    /**
     * @var UrlObject
     */
    protected $request;

    public function __construct(UrlObject $request)
    {
        parent::__construct();
        $this->request = $request;
    }

    /**
     * @return UrlObject
     */
    public function getUrlObject()
    {
        return $this->request;
    }
}