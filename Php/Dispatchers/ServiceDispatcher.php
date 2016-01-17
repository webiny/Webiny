<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\Dispatchers;

use Apps\Core\Php\RequestHandlers\ApiEvent;

class ServiceDispatcher extends AbstractApiDispatcher
{
    public function handle(ApiEvent $event)
    {
        if (!$event->getUrl()->startsWith('/services')) {
            return false;
        }

       die("Now we'll do our Service magic! :)");
    }
}