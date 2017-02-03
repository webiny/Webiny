<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Bootstrap;

use Apps\Core\Php\DevTools\Request;
use Apps\Core\Php\DevTools\Response\ApiResponse;
use Apps\Core\Php\DevTools\Response\HtmlResponse;
use Apps\Core\Php\DevTools\Response\AbstractResponse;
use Apps\Core\Php\DevTools\Response\ResponseEvent;
use Apps\Core\Php\PackageManager\App;
use Apps\Core\Php\PackageManager\AppScanner;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\Entity\Entity;
use Webiny\Component\Http\Http;
use Webiny\Component\Http\Response;
use Webiny\Component\Mongo\Mongo;
use Webiny\Component\Security\Security;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\UrlObject\UrlObjectException;
use Webiny\Component\StdLib\SingletonTrait;
use Apps\Core\Php\DevTools\WebinyTrait;
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
        Http::setConfig($this->wConfig()->get('Http', $emptyConfig));

        // scan all components to register routes and event handlers
        AppScanner::getInstance();

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
        if ($this->wRequest()->isApi() && $this->wRequest()->header('X-Webiny-Api-Aggregate')) {
            return $this->processMultipleRequests();
        }

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

    /**
     * This will read aggregated requests and execute each one of them as if they were sent individually.
     * All responses are aggregated into a single response.
     *
     * @return $this
     */
    public function processMultipleRequests()
    {
        $requests = $this->wRequest()->getRequestData()['requests'];
        $responses = [];
        $responseClass = '\Apps\Core\Php\DevTools\Response\AbstractResponse';
        $headers = [];
        foreach ($requests as $req) {
            if (count($headers)) {
                foreach (array_keys($headers) as $header) {
                    unset($_SERVER[$header]);
                }
                $headers = [];
            }

            Authorization::getInstance()->unsetUser();
            Request::deleteInstance();		              Request::deleteInstance();

            $_GET = $req['query'];
            $_SERVER['REQUEST_URI'] = $this->url($req['url'])->getPath();
            $_SERVER['REQUEST_METHOD'] = 'GET';
            $_SERVER['QUERY_STRING'] = http_build_query($req['query']);
            if (is_array($req['headers'])) {
                foreach ($req['headers'] as $header => $value) {
                    $headers['HTTP_' . $this->str($header)->replace('-', '_')->caseUpper()->val()] = $value;
                }
                $_SERVER = array_merge($_SERVER, $headers);
            }
            Request::getInstance();

            $response = $this->wEvents()->fire('Core.Bootstrap.Request', new BootstrapEvent(), $responseClass, 1);
            if ($response instanceof ApiResponse) {
                $responseData = $this->processResponse($response, true);
                $responseData['statusCode'] = $response->getStatusCode();
                $responses[] = $responseData;
            } else {
                $responses[] = null;
            }
        }

        $apiResponse = new ApiResponse($responses);
        $response = Response::create($apiResponse->output(), 200);

        return $response->send();
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
     * @param AbstractResponse $webinyResponse
     *
     * @return mixed
     */
    private function processResponse(AbstractResponse $webinyResponse, $return = false)
    {
        $event = new ResponseEvent($webinyResponse);
        $this->wEvents()->fire('Core.Bootstrap.Response', $event);

        if ($return && $webinyResponse instanceof ApiResponse) {
            return $webinyResponse->getData(true);
        }

        // Build response body
        $responseBody = $webinyResponse->output($this->wIsProduction() ? 0 : JSON_PRETTY_PRINT);
        $response = Response::create($responseBody, $webinyResponse->getStatusCode());
        $response->cacheControl()->setCacheControl($webinyResponse->getCacheControlHeaders());
        $response->send();
    }
}