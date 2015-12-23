<?php
use Apps\Core\Php\Bootstrap\Bootstrap;
use Webiny\Component\Http\Request;
use Webiny\Component\Http\Response;

$autoloader = require_once __DIR__ . '/../vendor/autoload.php';
$autoloader->addPsr4('Apps\\', __DIR__ . '/../Apps');

/**
 * Initialize the bootstrap
 */
error_reporting(E_ALL);
ini_set("display_errors", 1);
Bootstrap::getInstance()->run(Request::getInstance()->getCurrentUrl(true));