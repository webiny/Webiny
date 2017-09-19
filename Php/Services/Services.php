<?php

namespace Apps\Webiny\Php\Services;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Services\AbstractService;
use Apps\Webiny\Php\Lib\Apps\Parser\ServiceParser;
use Apps\Webiny\Php\Lib\Apps\App;

/**
 * Class Services
 */
class Services extends AbstractService
{
    protected static $classId = 'Webiny.Services.Services';

    protected function serviceApi(ApiContainer $api)
    {
        /**
         * @api.name Get system services
         * @api.description This method returns an overview of all active services
         */
        $api->get('/', function () {

            // Services listed here will not be returned in the final response.
            $excludeServices = $this->wRequest()->query('exclude', []);

            $singleService = false;
            $multipleServices = $this->wRequest()->query('classIds', false);

            if (!$multipleServices) {
                $singleService = $this->wRequest()->query('classId', false);
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
                    if (in_array($service['classId'], $excludeServices)) {
                        continue;
                    }

                    if ($multipleServices && !in_array($service['classId'], $multipleServices)) {
                        continue;
                    }

                    if (in_array('methods', $details)) {
                        $serviceParser = new ServiceParser($service['class']);
                        $service['methods'] = $serviceParser->getApiMethods();
                    }

                    if ($service['classId'] == $singleService) {
                        return $service;
                    }

                    $services[] = $service;
                }
            }

            return $services;
        });
    }

}