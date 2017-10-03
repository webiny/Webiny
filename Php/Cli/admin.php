<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 *
 * Usage example:
 * php Apps/Webiny/Php/Cli/admin.php http://domain.app email password
 */


use Apps\Webiny\Php\Entities\User;
use Webiny\Component\StdLib\Exception\AbstractException;

$autoloader = require_once getcwd() . '/vendor/autoload.php';
$autoloader->addPsr4('Apps\\Webiny\\', getcwd() . '/Apps/Webiny');

/**
 * Class Admin
 *
 * This script is used to create an admin user during initial Webiny installation (or later on through CLI)
 */
class Admin extends \Apps\Webiny\Php\Lib\AbstractCli
{
    public function run($email, $password)
    {
        // Create admin user
        try {
            $user = new User();
            $user->email = $email;
            $user->password = $password;
            $user->roles = [
                'administrator',
                'webiny-administrator',
                'webiny-marketplace',
                'webiny-app-notifications',
                'webiny-acl-api-token-manager',
                'webiny-logger-manager',
                'webiny-acl-user-manager',
                'webiny-i18n-manager',
                'webiny-dashboard',
                'webiny-api-discoverer'
            ];
            $user->firstName = '';
            $user->lastName = '';
            $user->meta['appNotifications'] = [
                'webiny-notification',
                'webiny-marketplace-notification'
            ];
            $user->save();
            die(json_encode(['status' => 'created']));
        } catch (AbstractException $e) {
            die(json_encode(['status' => 'failed', 'message' => $e->getMessage()]));
        }
    }
}

$release = new Admin($argv[1]);
$release->run($argv[2], $argv[3]);