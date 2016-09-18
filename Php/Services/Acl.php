<?php

namespace Apps\Core\Php\Services;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Services\AbstractService;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class Acl
 * @package Apps\Core\Php\Services
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
        $this->api('get', '/token', function () {
            return ['token' => $this->wConfig()->get('Application.Acl.Token')];
        });
    }
}