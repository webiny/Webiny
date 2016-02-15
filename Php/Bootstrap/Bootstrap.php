<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\Bootstrap;

use Apps\Core\Php\DevTools\Entity\Entity;
use Apps\Core\Php\DevTools\Request;
use Apps\Core\Php\DevTools\Response\ApiResponse;
use Apps\Core\Php\DevTools\Response\HtmlResponse;
use Apps\Core\Php\DevTools\Response\ResponseAbstract;
use Apps\Core\Php\DevTools\Response\ResponseEvent;
use Webiny\Component\Annotations\Annotations;
use Webiny\Component\Http\Response;
use Webiny\Component\Mongo\Mongo;
use Webiny\Component\Security\Security;
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

    /**
     * @var ErrorHandler
     */
    private $errorHandler;

    protected function init()
    {
        $this->errorHandler = new ErrorHandler();

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

        // Register database
        Mongo::setConfig($this->wConfig()->get('Mongo'));
        Entity::setConfig($this->wConfig()->get('Entity'));
        Security::setConfig($this->wConfig()->get('Security'));

        $this->wEvents()->fire('Core.Bootstrap.End');
    }

    public function run()
    {
        $responseClass = '\Apps\Core\Php\DevTools\Response\ResponseAbstract';
        /* @var $response ResponseAbstract */
        $response = $this->wEvents()->fire('Core.Bootstrap.Request', new BootstrapEvent(), $responseClass, 1);
        if ($response) {
            if ($response instanceof ApiResponse) {
                $response->setErrors($this->errorHandler->getErrors());
            }
            $this->processResponse($response);
        }

        // Output 404
        $response = new HtmlResponse('Add 404 handler!', 404);
        $this->processResponse($response);
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
        $currentDomain = $this->str($url)->caseLower()->trimRight('/')->val();

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
        if ($environment == 'development') {
            error_reporting(E_ALL);
            ini_set('display_errors', 1);
        } else {
            error_reporting(0);
            ini_set('display_errors', 0);
        }

        error_reporting(E_ALL);
        ini_set('display_errors', 1);
    }

    /**
     * @param ResponseAbstract $response
     */
    private function processResponse(ResponseAbstract $response)
    {
        $event = new ResponseEvent();
        $event->setOutput($response->output());
        $this->wEvents()->fire('Core.Bootstrap.Response', $event);

        // Build response body
        $responseBody = $event->getOutput();
        Response::create($responseBody, $response->getStatusCode())->send();
    }

}