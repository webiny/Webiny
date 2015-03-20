<?php
use Webiny\Component\ClassLoader\ClassLoader;
use Webiny\Component\Http\Request;

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once realpath(__DIR__ . '/../vendor/autoload.php');
$classLoaderMap = [
    'Webiny\Platform' => realpath(__DIR__.'/../').'/Vendors/Platform',
    'Apps' => realpath(__DIR__ . '/../').'/Apps'
];
ClassLoader::getInstance()->registerMap($classLoaderMap);

// Check if it's an API request
$api = Request::getInstance()->getCurrentUrl(true)->getPath(true)->startsWith('/api');

// Load only platform config and setup Storage, Mongo, Entity and initialize Router component with empty config
$platform = \Webiny\Platform\Bootstrap\Platform::getInstance()->prepare($api);

if(!$platform->isBackend()){
    /**
     * TODO: Frontend caching layer could be plugged in here
     *
     * Platform config is accessed using $platform->getConfig($key = null)
     * See $platform autocomplete for a list of all available methods
     *
     * If you want to access the output that wil be sent to browser, listen for 'Platform.BeforeSendOutput' event.
     * You get an instance of \Webiny\Platform\Events\OutputEvent passed to your event handler.
     * Use $event->getOutput() to get the actual HTML.
     *
     * Example of custom frontend route is located in: /Apps/Todo/Frontend/Test/Module.yaml
     */
}

// Load platform apps and register their services
$platform->loadApps();

if ($api) {
    $platform->runApi();
}
$platform->runApp();