<?php

namespace Apps\Core\Php\Services;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Services\AbstractService;
use Apps\Core\Php\PackageManager\Parser\ServiceParser;
use Apps\Core\Php\PackageManager\App;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\StdObjectWrapper;

/**
 * Class Services
 * @package Apps\Core\Php\Services
 */
class Services extends AbstractService
{
    use WebinyTrait, StdLibTrait;

    function __construct()
    {
        parent::__construct();
        /**
         * @api.name Get system services
         * @api.description This method returns an overview of all active services
         */
        $this->api('get', '/', function () {
            $singleService = $this->wRequest()->query('service', false);
            $withDetails = StdObjectWrapper::toBool($this->wRequest()->query('withDetails', false));
            $services = [];
            /* @var $app App */
            foreach ($this->wApps() as $app) {
                foreach($app->getServices() as $service){
                    if ($singleService && $service['class'] != $singleService) {
                        continue;
                    }

                    if($withDetails){
                        $serviceParser = new ServiceParser($service['class']);
                        $service['methods'] = $serviceParser->getApiMethods();
                    }

                    if ($service['class'] == $singleService) {
                        return $service;
                    }

                    $services[] = $service;
                }
            }
            
            return $services;
        });
    }
}