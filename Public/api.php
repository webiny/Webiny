<?php

require_once realpath(__DIR__.'/../Vendors/Platform/Autoload.php');

$app = \Platform\App\App::getInstance()->prepare()->runApi();