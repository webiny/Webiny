<?php

namespace Apps\Webiny\Php\Services;

use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\Services\AbstractService;
use Apps\Webiny\Php\Lib\Apps\App;

/**
 * Class Apps
 *
 * This service provides meta data about every app
 */
class Apps extends AbstractService
{
    function __construct()
    {
        parent::__construct();
        /**
         * @api.name Get all active apps meta
         * @api.description This method returns a list of meta data for each active app
         */
        $this->api('get', '/', function () {
            return $this->getAppsMeta();
        });

        /**
         * @api.name Get single app/spa meta
         * @api.description This method returns a set of meta data for given app name or all backend apps (if {appName} == "backend")
         */
        $this->api('get', '{appName}', function ($appName = null) {
            if ($appName === 'backend') {
                // Get Backend apps
                $apps = [];
                foreach ($this->getAppsMeta() as $meta) {
                    if ($this->str($meta['name'])->endsWith('.Backend') && $meta['name'] != 'Webiny.Backend') {
                        if ($meta['name'] === 'Faq.Backend') {
                            continue;
                        }
                        $apps[] = $meta;
                    }
                }

                return $apps;
            }

            return $this->getAppsMeta($appName);
        });
    }

    /**
     * Get apps meta
     *
     * @param null $app
     *
     * @return array|mixed
     * @throws AppException
     */
    public function getAppsMeta($app = null)
    {
        $assets = [];
        /* @var $appObj App */
        if (!$app) {
            foreach ($this->wApps() as $appObj) {
                $assets = array_merge($assets, $appObj->getBuildMeta());
            }

            return $assets;
        }

        $parts = explode('.', $app);
        $appObj = $this->wApps($parts[0]);
        if ($appObj) {
            if (isset($parts[1])) {
                return $appObj->getBuildMeta($parts[1]);
            }

            return $appObj->getBuildMeta();
        }

        return $assets;
    }
}