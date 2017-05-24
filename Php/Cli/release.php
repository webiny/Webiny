<?php
use Apps\Webiny\Php\PackageManager\App;

if (php_sapi_name() !== 'cli') {
    die('Invalid invocation!');
}

$autoloader = require_once getcwd() . '/vendor/autoload.php';
$autoloader->addPsr4('Apps\\Webiny\\', getcwd() . '/Apps/Webiny');

class Release
{
    use \Webiny\Component\StdLib\StdLibTrait, \Apps\Webiny\Php\DevTools\WebinyTrait;

    public function __construct($autoloader)
    {
        $this->autoloader = $autoloader;
        $this->absPath = getcwd() . '/';
    }

    public function run($domain)
    {
        $_SERVER = [];
        $_SERVER['SERVER_NAME'] = $domain;
        \Apps\Webiny\Php\Bootstrap\Bootstrap::getInstance();

        /* @var $app App */
        foreach ($this->wApps() as $app) {
            echo "Releasing '" . $app->getName() . "'...\n";
            // Run Release script for each app
            $app->getLifeCycleObject('Release')->run($app);
            echo "----------------\n";
        }
    }
}

$release = new Release($autoloader);
$release->run($argv[1]);

