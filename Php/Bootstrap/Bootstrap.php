<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\Bootstrap;

use Webiny\Component\Http\Request;
use Webiny\Component\StdLib\StdObject\UrlObject\UrlObject;
use Webiny\Component\StdLib\StdObjectTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\PackageManager\PackageScanner;

/**
 * This class is included in the index.php and it responsible to bootstrap the application.
 */
class Bootstrap
{
    use SingletonTrait, DevToolsTrait, StdObjectTrait;

    protected function init()
    {
        // read production configs
        $this->buildConfiguration("Production");

        // get additional config set
        $configSet = $this->getConfigSet();
        if ($configSet) {
            $this->buildConfiguration($configSet);
        }

        // set the environment
        $this->setEnvironment($this->wConfig()->get("Application.Environment", "production"));

        // scan all components to register routes and event handlers
        PackageScanner::getInstance();

        $this->wEvents()->fire('Core.Bootstrap.End');
    }

    public function run(UrlObject $request)
    {
        $response = $this->wEvents()->fire('Core.Bootstrap.HandleRequest', new BootstrapEvent($request));
        // TODO: Output response
    }

    private function buildConfiguration($configSet)
    {
        try {
            // get the configuration files
            $dir = $this->wStorage()->readDir("Configs/" . $configSet)->filter("*.yaml");

            // insert them into the global configuration object
            foreach ($dir as &$file) {
                $this->wConfig()->appendConfig($file->getKey());
            }

            // append config sets
            $this->wConfig()->appendConfig("Configs/ConfigSets.yaml");
        } catch (\Exception $e) {
            throw new \Exception("Unable to build config set " . $configSet . ". " . $e->getMessage());
        }
    }

    private function getConfigSet()
    {
        $configSets = $this->wConfig()->get("ConfigSets", []);
        $url = $this->wRequest()->getCurrentUrl(true)->getDomain();
        $currentDomain = $this->str($url)->caseLower()->trimRight('/')
                              ->val();

        $configSet = false;
        foreach ($configSets as $name => $domain) {
            if ($currentDomain == $this->str($domain)->caseLower()->trimRight('/')) {
                $configSet = $name;
            }
        }

        return $configSet;
    }

    private function setEnvironment($environment)
    {
        if ($environment == "development") {
            error_reporting(E_ALL);
            ini_set('display_errors', '1');
        } else {
            error_reporting(0);
            ini_set('display_errors', '0');
        }
    }

}