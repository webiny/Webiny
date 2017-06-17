<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\DevTools;

use Apps\Webiny\Php\Bootstrap\Bootstrap;

if (php_sapi_name() !== 'cli') {
    die('CLI scripts can only be executed from CLI context!');
}

abstract class AbstractCli
{
    use \Webiny\Component\StdLib\StdLibTrait, \Apps\Webiny\Php\DevTools\WebinyTrait;

    final public function __construct($domain)
    {
        $domain = $this->url($domain);
        $_SERVER['SERVER_NAME'] = $domain->getHost();
        if ($domain->getScheme() === 'https') {
            $_SERVER['HTTPS'] = true;
        }
        Bootstrap::getInstance();
    }
}