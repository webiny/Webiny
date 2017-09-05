<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\RequestHandlers;

use Apps\Webiny\Php\Lib\WebinyTrait;
use Apps\Webiny\Php\Lib\Response\HtmlResponse;

class Routes
{
    use WebinyTrait;

    public function handle()
    {
        $match = $this->wRouter()->match($this->wRequest()->getCurrentUrl());
        if ($match) {
            return new HtmlResponse($this->wRouter()->execute($match));
        }

        return null;
    }
}