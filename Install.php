<?php

namespace Webiny\Core;

use Composer\Script\Event;

class Install
{

    public static function postInstall(Event $event)
    {
        echo "\nWEBINY: POST INSTALL \n\n";
    }
}