<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\LifeCycle;

use Apps\Webiny\Php\Lib\Apps\App;

interface LifeCycleInterface
{
    public function run(App $app);
}