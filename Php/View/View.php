<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\View;

use Apps\Core\Php\DevTools\DevToolsTrait;

class View
{
    use DevToolsTrait;

    public function getEnvironment()
    {
        // TODO: debug problem with Production ConfigSet
        return $this->wConfig()->get('Application.Environment', 'production');
    }
}