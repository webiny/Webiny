<?php
namespace Webiny\Platform\Bootstrap;

use Webiny\Component\Entity\Entity;
use Webiny\Component\Router\Router;
use Webiny\Platform\Events;
use Webiny\Platform\Responses\HtmlResponse;
use Webiny\Platform\Responses\JsonErrorResponse;
use Webiny\Platform\Responses\JsonResponse;
use Webiny\Platform\Responses\ResponseAbstract;
use Webiny\Component\Config\ConfigException;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\Config\ConfigTrait;
use Webiny\Component\EventManager\EventManagerTrait;
use Webiny\Component\Http\HttpTrait;
use Webiny\Component\Http\Response;
use Webiny\Component\Mongo\Mongo;
use Webiny\Component\Rest\Rest;
use Webiny\Component\ServiceManager\ServiceManager;
use Webiny\Component\ServiceManager\ServiceManagerTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;
use Webiny\Component\StdLib\StdObject\UrlObject\UrlObject;
use Webiny\Component\Storage\Driver\Local\Local;
use Webiny\Component\Storage\File\LocalFile;
use Webiny\Component\Storage\Storage;
use Webiny\Component\Storage\StorageTrait;

/**
 * Class App is responsible for booting entire app
 *
 * @package Platform
 */
final class Platform
{
    use SingletonTrait, ConfigTrait, HttpTrait, StorageTrait, StdLibTrait, EventManagerTrait, ServiceManagerTrait;

    private $_isBackend = false;

    /**
     * App environment: Local|Development|Staging|Production
     * @var Environment
     */
    private $_environment;

    /**
     * @var ConfigObject
     */
    private $_config;
    /**
     * @var ArrayObject
     */
    private $_apps;

    /**
     * @var UrlObject
     */
    private $_requestUrl;

    /**
     * Get App config
     *
     * @param null|string $key
     * @param mixed       $default
     *
     * @return ConfigObject
     */
    public function getConfig($key = null, $default = null)
    {
        if ($this->isNull($key)) {
            return $this->_config;
        }

        return $this->_config->get($key, $default);
    }

    /**
     * Get app environment
     *
     * @return Environment
     */
    public function getEnvironment()
    {
        return $this->_environment;
    }

    /**
     * Get all Apps or module specified by $alias
     *
     * @param null|string $alias
     *
     * @return bool|App|ArrayObject
     */
    public function getApps($alias = null)
    {
        if (!$alias) {
            return $this->_apps;
        }

        return isset($this->_apps[$alias]) ? $this->_apps[$alias] : false;
    }

    public function getWebPath()
    {
        return $this->getConfig('Platform.WebPath');
    }

    public function getAbsPath()
    {
        return $this->getConfig('Platform.AbsPath');
    }

    public function getUploadsWebPath()
    {
        return $this->getConfig('Platform.UploadsWebPath');
    }

    public function getUploadsAbsPath()
    {
        return $this->getConfig('Platform.UploadsAbsPath');
    }

    public function getAppsWebPath()
    {
        return $this->getWebPath() . '/Apps';
    }

    public function getApiPath($url = '')
    {
        $url = $this->str($url)->trimLeft('/')->val();

        return rtrim($this->getConfig('Platform.ApiPath') . '/' . $url, '/');
    }

    public function isBackend()
    {
        return $this->_isBackend;
    }

    public function getAppsPath()
    {
        return $this->getConfig('Platform.AppsPath');
    }

    /**
     * Loop through available Apps and check if any of them can route the requested route.
     * If not, trigger 'Platform.HandleRequest' event to see if some custom handling exists.
     */
    public function runApp()
    {
        /* @var $app App */
        foreach ($this->_apps as $app) {
            if ($app->canRoute($this->_requestUrl)) {
                $this->processResponse($app->run());
            }
        }

        $response = $this->eventManager()
                         ->fire('Platform.HandleRequest', null, '\Webiny\Platform\Responses\ResponseAbstract');

        // If any event listener processed the request - send response to browser
        if (isset($response[0])) {
            $this->processResponse($response[0]);
        }

        // If none of the above happened - respond with empty output
        $response = new HtmlResponse('Sheesh...didn\'t get to render anything :(');
        $this->processResponse($response);
    }

    public function runApi()
    {
        header('Access-Control-Allow-Origin: ' . trim($this->getWebPath(), '/'));

        /**
         * REST routing
         */
        $parts = $this->_requestUrl->getPath(true)->explode('/')->filter()->values()->val();

        Rest::setConfig($this->getConfig('Rest'));

        $rest = Rest::initRest('Api');
        $response = $rest->processRequest();
        if (!$response->getError()) {
            $response = $response->getData();
        } else {
            $response = new JsonErrorResponse($response->getError());
            $response->output();
        }

        /* @var $result ResponseAbstract */
        if ($response instanceof JsonResponse) {
            $response->output();
        } else {
            $this->processResponse($response);
        }
        $response = new JsonResponse([], true, 'Invalid response from service!', 'invalid-response');
        $response->output();
    }

    /**
     * Load platform config and active Apps
     *
     * @param bool $api
     *
     * @return $this
     * @throws ConfigException
     * @throws \Webiny\Component\ServiceManager\ServiceManagerException
     * @throws \Webiny\Component\StdLib\Exception\Exception
     */
    public function prepare($api = false)
    {
        $this->_apps = $this->arr();
        $this->_config = new ConfigObject([]);
        $this->_requestUrl = $this->httpRequest()->getCurrentUrl(true);

        /**
         * Load config files
         */
        $localDriver = new Local(__DIR__ . '/../../../Configs');
        $storage = new Storage($localDriver);

        /**
         * Determine environment
         */
        $this->_environment = new Environment();

        $config = new LocalFile($this->_environment->getName() . '.yaml', $storage);

        /**
         * Build main config for current environment
         */
        try {
            $this->_config->mergeWith($this->config()->yaml($config->getAbsolutePath()));
        } catch (ConfigException $e) {
            die($e->getMessage() . ' Trying to load: <strong>' . $config->getAbsolutePath(
                ) . '</strong> in ' . __CLASS__ . ' on line ' . __LINE__);
        }

        /**
         * Error reporting
         */
        $errorReporting = $this->getConfig('Platform.Error.Reporting', true) ? E_ALL : 0;
        error_reporting($errorReporting);
        ini_set('display_errors', $errorReporting);

        /**
         * Register services
         */
        foreach ($this->getConfig()->get('Services') as $sName => $sConfig) {
            ServiceManager::getInstance()->registerService($sName, $sConfig);
        }

        Storage::setConfig($this->getConfig()->get('Storage', []));
        Mongo::setConfig($this->getConfig('Mongo'));
        Entity::setConfig($this->getConfig('Entity'));
        Router::setConfig(new ConfigObject([]));

        $this->_determineBackend($api);

        return $this;
    }

    public function loadApps(){
        $appLoader = new AppLoader($this->getConfig());
        $this->_apps = $appLoader->loadApps($this->isBackend());
        
        foreach ($this->_apps as $app) {
            $this->_config->mergeWith($app->getConfig());
        }
        
        /**
         * Register services, events, storage services, etc.
         */
        $this->_registerServices();
    }

    /**
     * @param ResponseAbstract $response
     */
    public function processResponse(ResponseAbstract $response)
    {
        $event = new Events\OutputEvent();
        $event->setOutput($response->output());
        $this->eventManager()->fire('Platform.RenderOutput', $event);

        $this->eventManager()->fire('Platform.BeforeSendOutput', $event);

        // Build response body
        $responseBody = $event->getOutput();
        Response::create($responseBody)->send();
        die();
    }

    /**
     * Register services after Apps were loaded
     *
     * @throws \Webiny\Component\EventManager\EventManagerException
     * @throws \Webiny\Component\ServiceManager\ServiceManagerException
     * @throws \Webiny\Component\StdLib\Exception\Exception
     */
    private function _registerServices()
    {
        /**
         * Register event listeners
         */
        foreach ($this->getConfig('Events', []) as $eventName => $listeners) {
            foreach ($listeners as $listener) {
                $this->eventManager()
                     ->listen($eventName)
                     ->handler($listener->get('Handler'))
                     ->priority($listener->get('Priority', 300));
            }
        }


        /**
         * Register storage services
         */
        Storage::setConfig($this->getConfig()->get('Storage', []));

        foreach ($this->getConfig('Services') as $sName => $sConfig) {
            ServiceManager::getInstance()->registerService($sName, $sConfig, true);
        }
    }

    private function _determineBackend($isApi)
    {
        $path = $this->_requestUrl->getPath(true);
        if (!$isApi) {
            $this->_isBackend = $path->startsWith('/' . $this->getConfig('Platform.Backend.Prefix'));
        } else {
            $parts = $path->explode('/')->filter()->values()->val();
            $this->_isBackend = lcfirst($parts[2]) == 'backend';
        }
    }
}