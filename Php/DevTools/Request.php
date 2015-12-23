<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\DevTools;

use Webiny\Component\StdLib\SingletonTrait;

/**
 * Provides you with access to an object containing the data about current request
 */
class Request
{
    use SingletonTrait;

    /**
     * @var \Webiny\Component\Http\Request
     */
    static private $request;

    protected function init()
    {
        self::$request = \Webiny\Component\Http\Request::getInstance();
    }

    /**
     * @return \Webiny\Component\Http\Request
     */
    public function getRequest()
    {
        return self::$request;
    }
}
