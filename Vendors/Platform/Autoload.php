<?php
/**
 * Setup autoloader
 */
use Webiny\Component\ClassLoader\ClassLoader;

require_once realpath(__DIR__ . '/../Webiny/autoload.php');

$classLoaderMap = [
    'Webiny\Platform' => realpath(__DIR__),
    'Apps' => realpath(__DIR__ . '/../../Apps')
];
ClassLoader::getInstance()->registerMap($classLoaderMap);