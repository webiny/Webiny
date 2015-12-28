<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\Bootstrap;

use Webiny\Component\EventManager\Event;
use Webiny\Component\Http\Request;

/**
 * This class is included in the index.php and it responsible to bootstrap the application.
 */
class BootstrapEvent extends Event
{
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
}