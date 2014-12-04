<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once realpath(__DIR__.'/../Vendors/Platform/Autoload.php');
\Webiny\Platform\Bootstrap\Platform::getInstance()->prepare()->runApp();