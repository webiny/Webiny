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
use Webiny\Component\Entity\Entity;
use Webiny\Component\Http\Response;
use Webiny\Component\Mongo\Mongo;
use Webiny\Component\Security\Security;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\UrlObject\UrlObjectException;
use Webiny\Component\StdLib\SingletonTrait;
use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\PackageManager\PackageScanner;

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

    protected function init()
    {
        // read production configs
        $this->buildConfiguration('Production');

        // get additional config set
        $configSet = $this->getConfigSet();
        if ($configSet) {
            $this->buildConfiguration($configSet);
        }

        // set error handler
        $this->errorHandler = new ErrorHandler();

        // scan all components to register routes and event handlers
        PackageScanner::getInstance();

        // Register database
        Mongo::setConfig($this->wConfig()->get('Mongo'));
        Entity::setConfig($this->wConfig()->get('Entity'));
        Security::setConfig($this->wConfig()->get('Security'));

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
                $this->wConfig()->appendConfig($file->getKey());
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
                if ($currentDomain == $this->url($domain)->getDomain()) {
                    $configSet = $name;
                }
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
        $responseBody = $response->output();
        Response::create($responseBody, $response->getStatusCode())->send();
    }
}