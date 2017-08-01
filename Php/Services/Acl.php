<?php

namespace Apps\Webiny\Php\Services;

use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\DevTools\Services\AbstractService;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class Acl
 * @package Apps\Webiny\Php\Services
 */
class Acl extends AbstractService
{
    use WebinyTrait, StdLibTrait;

    function __construct()
    {
        parent::__construct();
        /**
         * @api.name Get system API token
         * @api.description Returns a system API token for use with 3rd party requests
         */
        $this->api('GET', '/token', function () {
            return ['token' => $this->wConfig()->get('Application.Acl.Token')];
        });
    }
}