<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\RequestHandlers;

use Apps\Core\Php\Bootstrap\BootstrapEvent;

class Api
{
    public function handle(BootstrapEvent $event)
    {
        if(!$event->getUrlObject()->getPath(true)->startsWith('/api')){
            return false;
        }

        die("API!");
    }
}