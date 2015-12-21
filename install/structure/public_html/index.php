<?php
use Webiny\Component\Http\Request;
use Webiny\Component\Http\Response;
use Webiny\Core\Platform;

$autoloader = require_once __DIR__ . '/../vendor/autoload.php';
$autoloader->addPsr4('Apps\\', __DIR__ . '/../Apps');

$currentUrl = Request::getInstance()->getCurrentUrl(true);
$platform = Platform::getInstance();
$platform->setRootDir(__DIR__ . '/..')->setRequest($currentUrl)->prepare();

// Check if it's an API request
$api = $currentUrl->getPath(true)->startsWith('/api');

if ($api) {
    $platform->runApi();
}
$platform->runApp();