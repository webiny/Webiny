<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\RequestHandlers;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Response\ApiResponse;
use Webiny\Component\Router\Matcher\UrlMatcher;
use Webiny\Component\Router\Route\Route;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\Directory\Directory;
use Webiny\Component\Storage\File\File;

class AppsMeta
{
    use DevToolsTrait, StdLibTrait;

    public function handle(ApiEvent $event)
    {
        // Get all apps
        $path = $event->getRequest()->getCurrentUrl(true)->getPath(true);
        if ($path->val() == '/api/apps') {
            return new ApiResponse($this->getAppsMeta());
        }

        // Get Backend apps
        if ($path->val() == '/api/apps/backend') {
            $apps = [];
            foreach ($this->getAppsMeta() as $app => $assets) {
                if ($this->str($app)->endsWith('.Backend') && $app != 'Core.Backend') {
                    $apps[$app] = $assets;
                }
            }

            return new ApiResponse($apps);
        }

        // Get single app meta
        $callback = [
            'Class'  => get_class($this),
            'Method' => 'getAppMeta'
        ];

        $route = new Route('/api/apps/{appName}', $callback, ['appName' => ['Pattern' => '.*?']]);
        $matchedRoute = (new UrlMatcher())->match($event->getRequest()->getCurrentUrl(true), $route);

        if ($matchedRoute) {
            return new ApiResponse($this->wRouter()->execute($matchedRoute));
        }

        return null;
    }

    public function getAppMeta($appName)
    {
        return $this->getAppsMeta()[$appName];
    }

    private function getAppsMeta()
    {
        if($this->wIsProduction()){
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