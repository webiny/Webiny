<?php
use Apps\Webiny\Php\Entities\User;
use Webiny\Component\StdLib\Exception\AbstractException;

if (php_sapi_name() !== 'cli') {
    die('Invalid invocation!');
}

$autoloader = require_once getcwd() . '/vendor/autoload.php';
$autoloader->addPsr4('Apps\\Webiny\\', getcwd() . '/Apps/Webiny');


$_SERVER = [];
$_SERVER['SERVER_NAME'] = $argv[1];

\Apps\Webiny\Php\Bootstrap\Bootstrap::getInstance();


// Create admin user
try {
    $user = new User();
    $user->email = $argv[2];
    $user->password = $argv[3];
    $user->roles = ['administrator', 'webiny-acl-api-token-manager', 'webiny-logger-manager', 'webiny-acl-user-manager'];
    $user->firstName = '';
    $user->lastName = '';
    $user->save();
    echo('created');
} catch (AbstractException $e) {
    echo('exists');
}
