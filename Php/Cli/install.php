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

    private $host = null;

    public function __construct($autoloader)
    {
        $this->autoloader = $autoloader;
        $this->absPath = getcwd() . '/';

        // Install script can only be executed using Local config set
        try {
            $config = $this->wConfig()->parseConfig('Configs/Local/Application.yaml');
            $this->host = $config->get('Application.WebPath');
        } catch (ConfigException $e) {
            // In case no Local config set is present, use domain in Production config set
        } finally {
            if (empty($this->host)) {
                $config = $this->wConfig()->parseConfig('Configs/Production/Application.yaml');
                $this->host = $config->get('Application.WebPath');
            }
        }
    }

    public function run($app, $host = null)
    {
        if (!$host) {
            $host = $this->host;
        }

        $_SERVER = [];
        $_SERVER['SERVER_NAME'] = $this->url($host)->getHost();
        \Apps\Core\Php\Bootstrap\Bootstrap::getInstance();
        $appInstance = $this->wApps($app);
        if ($appInstance) {
            $appInstance->getLifeCycleObject('Install')->run($appInstance);
        }
    }
}

$release = new Install($autoloader);
$release->run($argv[1], $argv[2] ?? null);

