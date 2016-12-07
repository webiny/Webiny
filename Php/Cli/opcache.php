<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';

use Adoy\FastCGI\Client;

error_reporting(0);
ini_set('display_errors', 0);
if (php_sapi_name() !== 'cli') {
    opcache_reset();
} else {
    try {
        $client = new Client('unix://' . $argv[1], -1);
        $client->request([
            'REQUEST_METHOD'  => 'POST',
            'SCRIPT_FILENAME' => __FILE__,
        ], '');
        \cli\line("%4\n\n    OPCache flushed successfully!\n%4%n");
    } catch (\Exception $e) {
        \cli\line("%1\n\n    OPCache flush failed for socket %9$argv[1]%n%1\n    " . $e->getMessage() . "\n%1%n");
    }
}