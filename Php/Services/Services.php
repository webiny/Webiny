<?php

namespace Apps\Webiny\Php\Services;

use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\DevTools\Services\AbstractService;
use Apps\Webiny\Php\AppManager\Parser\ServiceParser;
use Apps\Webiny\Php\AppManager\App;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class Services
 * @package Apps\Webiny\Php\Services
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

            // Services listed here will not be returned in the final response.
            $excludeServices = $this->wRequest()->query('exclude', []);

            $singleService = false;
            $multipleServices = $this->wRequest()->query('services', false);

            if (!$multipleServices) {
                $singleService = $this->wRequest()->query('service', false);
                if ($singleService) {
                    $multipleServices = [$singleService];
                }
            }

            $details = $this->wRequest()->query('details', '');
            $details = explode(',', $details);

            $services = [];
            /* @var $app App */
            foreach ($this->wApps() as $app) {
                foreach ($app->getServices() as $service) {
                    if (in_array($service['class'], $excludeServices)) {
                        continue;
                    }

                    if ($multipleServices && !in_array($service['class'], $multipleServices)) {
                        continue;
                    }

                    if (in_array('methods', $details)) {
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