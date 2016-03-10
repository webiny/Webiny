<?php
namespace Apps\Core\Php\Services;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Services\AbstractService;
use Apps\Core\Php\Dispatchers\ApiExpositionTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\Directory\Directory;
use Webiny\Component\Storage\File\File;

/**
 * Class Apps
 *
 * This service provides meta data about every app
 */
class Apps extends AbstractService
{
    function __construct()
    {
        $this->api('get', 'index', function ($appName = null) {
            return $this->index($appName);
        });
    }

    private function index($appName = null)
    {
        if (!$appName) {
            return $this->getAppsMeta();
        }

        if ($appName === 'backend') {
            // Get Backend apps
            $apps = [];
            foreach ($this->getAppsMeta() as $app => $assets) {
                if ($this->str($app)->endsWith('.Backend') && $app != 'Core.Backend') {
                    $apps[$app] = $assets;
                }
            }

            return $apps;
        }

        return $this->getAppsMeta($appName);
    }

    /**
     * Get apps meta
     *
     * @param null $app
     *
     * @return array|mixed
     */
    public function getAppsMeta($app = null)
    {
        if ($this->wIsProduction()) {
            $storage = $this->wStorage('ProductionBuild');
        } else {
            $storage = $this->wStorage('DevBuild');
        }

        if (!$app) {
            // If all apps are required we need to fetch meta only for versions currently enabled
            $apps = ['Core' => null];
            foreach ($this->wConfig()->get('Apps')->toArray() as $enabledApp => $version) {
                $apps[$enabledApp] = str_replace('.', '_', $version);
            }
        } else {
            // If specific app is given, fetch only one meta.json of the active app version
            list($appName, $jsApp) = explode('.', $app);
            if ($appName === 'Core') {
                $key = $appName . '/' . $jsApp;
            } else {
                $version = $this->wConfig()->get('Apps.' . $appName);
                $key = $appName . '/' . str_replace('.', '_', $version) . '/' . $jsApp;
            }
            $meta = new File($key . '/meta.json', $storage);
            
            return json_decode($meta->getContents(), true);
        }

        // Fetch meta.json of each active app
        $assets = [];
        foreach ($apps as $appName => $appVersion) {
            $key = $appVersion ? $appName . '/' . $appVersion : $appName;
            $files = new Directory($key, $storage, 1, '*meta.json');
            /* @var $file File */
            foreach ($files as $file) {
                $data = json_decode($file->getContents(), true);
                $assets[$data['name']] = $data;
            }
        }

        return $assets;
    }
}