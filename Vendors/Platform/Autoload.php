<?php
/**
 * Setup autoloader
 */
use Webiny\Component\ClassLoader\ClassLoader;

require_once realpath(__DIR__ . '/../Webiny/vendor/autoload.php');

$classLoaderMap = [
    'Platform' => realpath(__DIR__),
    'Modules' => realpath(__DIR__ . '/../../Modules')
];
ClassLoader::getInstance()->registerMap($classLoaderMap);