<?php

$autoloader = require_once __DIR__ . '/../vendor/autoload.php';
$autoloader->addPsr4('Apps\\Core\\', __DIR__ . '/../Apps/Core');

use Apps\Core\Php\Bootstrap\Bootstrap;

/**
 * Initialize the bootstrap
 */
Bootstrap::getInstance()->multiRun();