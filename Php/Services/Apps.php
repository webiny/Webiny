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

        return $this->getAppsMeta()[$appName];
    }

    private function getAppsMeta()
    {
        if ($this->wIsProduction()) {
            $storage = $this->wStorage('ProductionBuild');
        } else {
            $storage = $this->wStorage('DevBuild');
        }

        $files = new Directory('', $storage, true, '*meta.json');

        $assets = [];
        /* @var $file File */
        foreach ($files as $file) {
            $data = json_decode($file->getContents(), true);
            $assets[$data['name']] = $data;
        }

        return $assets;
    }
}