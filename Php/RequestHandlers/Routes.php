<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\RequestHandlers;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Response\HtmlResponse;

class Routes
{
    use DevToolsTrait;

    public function handle()
    {
        $match = $this->wRouter()->match($this->wRequest()->getCurrentUrl());
        if ($match) {
            return new HtmlResponse($this->wRouter()->execute($match));
        }

        return null;
    }
}