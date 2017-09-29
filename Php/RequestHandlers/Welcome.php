<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\RequestHandlers;

use Apps\Webiny\Php\Lib\WebinyTrait;

class Welcome
{
    use WebinyTrait;

    public function handle()
    {
        return $this->wTemplateEngine()->fetch('Webiny:Templates/Welcome.tpl');
    }
}