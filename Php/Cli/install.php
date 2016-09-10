<?php
// Execute as: php Apps/Core/Php/Cli/install.php domain.app Core

use Webiny\Component\Config\ConfigException;

if (php_sapi_name() !== 'cli') {
    die('Invalid invocation!');
}

$autoloader = require_once getcwd() . '/vendor/autoload.php';
$autoloader->addPsr4('Apps\\Core\\', getcwd() . '/Apps/Core');

class Install
{
    use \Webiny\Component\StdLib\StdLibTrait, \Apps\Core\Php\DevTools\WebinyTrait;

    public function __construct($autoloader)
    {
        $this->autoloader = $autoloader;
        $this->absPath = getcwd() . '/';
        
        // Install script can only be executed using Local config set
        try {
            $this->config = $this->wConfig()->parseConfig('Configs/Local/Application.yaml');
        } catch (ConfigException $e) {
            die('Missing Local config set! Make sure you have a "Local" config set present in your project');
        }
    }

    public function run($app)
    {
        $_SERVER = [];
        $_SERVER['SERVER_NAME'] = $this->url($this->config->get('Application.WebPath'))->getHost();
        \Apps\Core\Php\Bootstrap\Bootstrap::getInstance();
        $appInstance = $this->wApps($app);
        $installer = $appInstance->getInstall();
        if ($installer) {
            $installer($appInstance);
        }
    }
}

$release = new Install($autoloader);
$release->run($argv[1]);

