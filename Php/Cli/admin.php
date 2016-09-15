<?php
use Apps\Core\Php\Entities\User;
use Webiny\Component\StdLib\Exception\AbstractException;

if (php_sapi_name() !== 'cli') {
    die('Invalid invocation!');
}

$autoloader = require_once getcwd() . '/vendor/autoload.php';
$autoloader->addPsr4('Apps\\Core\\', getcwd() . '/Apps/Core');


$_SERVER = [];
$_SERVER['SERVER_NAME'] = $argv[1];

\Apps\Core\Php\Bootstrap\Bootstrap::getInstance();


// Create admin user
try {
    $user = new User();
    $user->email = $argv[2];
    $user->password = $argv[3];
    $user->roles = ['administrator', 'core-acl-api-token-manager', 'core-logger-manager', 'core-acl-user-manager'];
    $user->firstName = '';
    $user->lastName = '';
    $user->save();
    echo('created');
} catch (AbstractException $e) {
    echo('exists');
}
