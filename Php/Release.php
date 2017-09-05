<?php

namespace Apps\Webiny\Php;

use Apps\Webiny\Php\AppManager\App;

class Release extends \Apps\Webiny\Php\DevTools\LifeCycle\Release
{
    public function run(App $app)
    {
        parent::run($app);
    }
}