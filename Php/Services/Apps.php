<?php
namespace Apps\Core\Php\Services;

use Apps\Core\Php\DevTools\Exceptions\AppException;
use Apps\Core\Php\DevTools\Services\AbstractService;
use Apps\Core\Php\PackageManager\App;

/**
 * Class Apps
 *
 * This service provides meta data about every app
 */
class Apps extends AbstractService
{
    function __construct()
    {
        /**
         * @api.name Get all active apps meta
         */
        $this->api('get', '/', function () {
            return $this->getAppsMeta();
        });

        /**
         * @api.name Get single app/spa meta
         */
        $this->api('get', '{appName}', function ($appName = null) {
            if ($appName === 'backend') {
                // Get Backend apps
                $apps = [];
                foreach ($this->getAppsMeta() as $meta) {
                    if ($this->str($meta['name'])->endsWith('.Backend') && $meta['name'] != 'Core.Backend') {
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