<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\RequestHandlers;

use Apps\Core\Php\Bootstrap\BootstrapEvent;
use Apps\Core\Php\DevTools\DevToolsTrait;

class Api
{
    use DevToolsTrait;

    public function handle(BootstrapEvent $event)
    {
        if(!$event->getUrlObject()->getPath(true)->startsWith('/api')){
            return false;
        }

        $apiEvent = new ApiEvent($event->getUrlObject());
        $results = $this->wEvents()->fire('Api.Before', $apiEvent);

        if(count($results) && $results[0]){
            return $results[0];
        }

        die("RUN API...");
    }
}