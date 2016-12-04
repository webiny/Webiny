<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Bootstrap;

use Apps\Core\Php\DevTools\Response\ApiResponse;
use Apps\Core\Php\DevTools\Response\HtmlResponse;
use Apps\Core\Php\DevTools\Response\AbstractResponse;
use Apps\Core\Php\DevTools\Response\ResponseEvent;
use Apps\Core\Php\PackageManager\App;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\Entity\Entity;
use Webiny\Component\Http\Response;
use Webiny\Component\Mongo\Mongo;
use Webiny\Component\Security\Security;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\UrlObject\UrlObjectException;
use Webiny\Component\StdLib\SingletonTrait;
use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\PackageManager\PackageScanner;
use Webiny\Component\Storage\Storage;

/**
 * This class is included in the index.php and it responsible to bootstrap the application.
 */
class Bootstrap
{
    use SingletonTrait, WebinyTrait, StdLibTrait;

    /**
     * @var ErrorHandler
     */
    private $errorHandler;
    /**
     * @var array Js configs to merge after config set is loaded completely
     */
    private $jsConfigs = [];

    protected function init()
    {
        // read production configs
        $this->buildConfiguration('Base');

        // get additional config set
        $configSet = $this->getConfigSet();
        if ($configSet) {
            $this->buildConfiguration($configSet);
        }

        // Append Js configs (these need to be loaded at the very end to inject proper values)
        foreach ($this->jsConfigs as $jsConfig) {
            $this->wConfig()->appendConfig($jsConfig);
        }

        // set error handler
        $this->errorHandler = new ErrorHandler();


        // Set component configs
        $emptyConfig = new ConfigObject();
        Mongo::setConfig($this->wConfig()->get('Mongo', $emptyConfig));
        Entity::setConfig($this->wConfig()->get('Entity', $emptyConfig));
        Security::setConfig($this->wConfig()->get('Security', $emptyConfig));
        Storage::setConfig($this->wConfig()->get('Storage', $emptyConfig));

        // scan all components to register routes and event handlers
        PackageScanner::getInstance();

        /* @var $app App */
        foreach ($this->wApps() as $app) {
            $bootstrap = $app->getBootstrap();
            if ($bootstrap) {
                $bootstrap->run($app);
            }
        }

        $this->wEvents()->fire('Core.Bootstrap.End');
    }

    public function run()
    {
        $responseClass = '\Apps\Core\Php\DevTools\Response\AbstractResponse';
        /* @var $response AbstractResponse */
        $response = $this->wEvents()->fire('Core.Bootstrap.Request', new BootstrapEvent(), $responseClass, 1);
        if ($response) {
            if ($response instanceof ApiResponse) {
                $response->setErrors($this->errorHandler->getErrors());
                $this->errorHandler->saveErrorsToLogger();
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
            $dir = $this->wStorage()->readDir('Configs/' . $configSet)->filter('*.yaml');

            // insert them into the global configuration object
            foreach ($dir as &$file) {
                $key = $this->str($file->getKey());
                if ($key->endsWith('Js.yaml')) {
                    $this->jsConfigs[] = $key->val();
                    continue;
                }
                $this->wConfig()->appendConfig($key->val());
            }

            // append config sets
            $this->wConfig()->appendConfig('Configs/ConfigSets.yaml');
        } catch (\Exception $e) {
            throw new \Exception('Unable to build config set ' . $configSet . '. ' . $e->getMessage());
        }
    }

    private function getConfigSet()
    {
        $configSets = $this->wConfig()->get('ConfigSets', []);
        try {
            $url = $this->wRequest()->getCurrentUrl(true)->getDomain();
            $currentDomain = $this->str($url)->caseLower()->trimRight('/')->val();

            $configSet = false;
            foreach ($configSets as $name => $domain) {
                if ($domain instanceof ConfigObject) {
                    foreach ($domain as $d) {
                        if ($currentDomain == $this->url($d)->getDomain()) {
                            $configSet = $name;
                            break 2;
                        }
                    }
                } elseif ($currentDomain == $this->url($domain)->getDomain()) {
                    $configSet = $name;
                    break;
                }
            }
            if (!$configSet) {
                $configSet = 'Production';
            }
        } catch (UrlObjectException $e) {
            $configSet = 'Production';
        }

        return $configSet;
    }

    /**
     * @param AbstractResponse $response
     */
    private function processResponse(AbstractResponse $response)
    {
        $event = new ResponseEvent($response);
        $this->wEvents()->fire('Core.Bootstrap.Response', $event);

        // Build response body
        $responseBody = $response->output($this->wIsProduction() ? 0 : JSON_PRETTY_PRINT);
        Response::create($responseBody, $response->getStatusCode())->send();
    }
}