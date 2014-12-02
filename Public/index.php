<?php

error_reporting(E_ALL);

require_once realpath(__DIR__.'/../Vendors/Platform/Autoload.php');

\Platform\App\App::getInstance()->prepare()->runApp();