<?php

namespace Apps\Core\Php;

use Apps\Core\Php\PackageManager\App;

class Release extends \Apps\Core\Php\DevTools\LifeCycle\Release
{
    public function run(App $app)
    {
        parent::run($app);
    }
}