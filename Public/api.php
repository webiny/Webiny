<?php

require_once realpath(__DIR__.'/../Vendors/Platform/Autoload.php');

$app = \Webiny\Platform\Bootstrap\Platform::getInstance()->prepare()->runApi();