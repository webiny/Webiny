<?php

use Webiny\Platform\Bootstrap\Platform;
require_once realpath(__DIR__.'/../Vendors/Platform/Autoload.php');
$app = Platform::getInstance()->prepare()->runApi();