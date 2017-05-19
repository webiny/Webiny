<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools\LifeCycle;

use Apps\Core\Php\PackageManager\App;

interface LifeCycleInterface
{
    public function run(App $app);
}