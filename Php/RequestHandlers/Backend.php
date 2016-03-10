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

class Backend
{
    use DevToolsTrait;

    public function handle()
    {
        if (!$this->wRequest()->getCurrentUrl(true)->getPath(true)->startsWith('/' . $this->wConfig()->get('Application.Backend'))) {
            return false;
        }

        $tpl = $this->wConfig()->get('Application.AbsolutePath') . 'Apps/Core/Templates/Webiny.tpl';
        $html = $this->wTemplateEngine()->fetch($tpl);

        return new HtmlResponse($html);
    }
}