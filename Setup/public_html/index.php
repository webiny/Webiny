<?php
$autoloader = require_once __DIR__ . '/../vendor/autoload.php';
$autoloader->addPsr4('Apps\\Webiny\\', __DIR__ . '/../Apps/Webiny');

use Apps\Webiny\Php\Bootstrap\Bootstrap;

/**
 * Initialize the bootstrap
 */

Bootstrap::getInstance()->run();