<?php

namespace Apps\Core\Php\Services;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Services\AbstractService;
use Apps\Core\Php\PackageManager\App;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class Services
 * @package Apps\Core\Php\Services
 */
class Services extends AbstractService
{
    use WebinyTrait, StdLibTrait;

    function __construct()
    {
        $this->api('get', '/', function () {
            $withDetails = $this->wRequest()->query('withDetails', false);
            $services = [];
            /* @var $app App */
            foreach ($this->wApps() as $app) {
                foreach($app->getServices($withDetails) as $service){
                    $services[] = $service;
                }
            }
            
            return $services;
        });
    }
}