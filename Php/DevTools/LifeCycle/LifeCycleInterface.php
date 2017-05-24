<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\DevTools\LifeCycle;

use Apps\Webiny\Php\PackageManager\App;

interface LifeCycleInterface
{
    public function run(App $app);
}