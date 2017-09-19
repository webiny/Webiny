<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 *
 * Usage example:
 * php Apps/Webiny/Php/Cli/install.php http://domain.app Webiny
 */

$autoloader = require_once getcwd() . '/vendor/autoload.php';
$autoloader->addPsr4('Apps\\Webiny\\', getcwd() . '/Apps/Webiny');

class Install extends \Apps\Webiny\Php\Lib\AbstractCli
{
    public function run($app)
    {
        $appInstance = $this->wApps($app);
        if ($appInstance) {
            $appInstance->install();
        }
    }
}

$release = new Install($argv[1]);
$release->run($argv[2]);

