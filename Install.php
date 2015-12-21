<?php

namespace Webiny\Core;

use Composer\Script\Event;
use Composer\Installer\PackageEvent;

class Install
{

    public static function postInstall(Event $event)
    {
        print_r($event);
    }
}