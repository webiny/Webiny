<?php

namespace Webiny\Core;

use Composer\Script\Event;
use Composer\Installer\PackageEvent;

class Install
{

    public static function postPackageInstall(PackageEvent $event)
    {
        $installedPackage = $event->getOperation()->getPackage();
        // do stuff
        print_r($event);
    }
}