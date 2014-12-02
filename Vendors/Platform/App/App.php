<?php
namespace Platform\App;

use Modules\Core\Handlers\RenderApp;
use Platform\Events;
use Platform\Responses\HtmlResponse;
use Platform\Responses\JsonResponse;
use Platform\Responses\ResponseAbstract;
use Webiny\Component\Config\ConfigException;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\Config\ConfigTrait;
use Webiny\Component\EventManager\Event;
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
final class App
{
    use SingletonTrait, ConfigTrait, HttpTrait, StorageTrait, StdLibTrait, EventManagerTrait, ServiceManagerTrait;

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
    private $_modules;

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
        if($this->isNull($key)) {
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
     * Get all modules or module specified by $alias
     *
     * @param null|string $alias
     *
     * @return bool|Module|ArrayObject
     */
    public function getModules($alias = null)
    {
        if(!$alias) {
            return $this->_modules;
        }

        return isset($this->_modules[$alias]) ? $this->_modules[$alias] : false;
    }

    public function getWebPath()
    {
        return $this->getConfig('App.WebPath');
    }

    public function getAbsPath()
    {
        return $this->getConfig('App.AbsPath');
    }

    public function getUploadsWebPath()
    {
        return $this->getConfig('App.UploadsWebPath');
    }

    public function getUpoadsAbsPath()
    {
        return $this->getConfig('App.UploadsAbsPath');
    }

    public function getModulesWebPath()
    {
        return $this->getWebPath() . '/Modules';
    }

    public function getApiPath($url = '')
    {
        $url = $this->str($url)->trimLeft('/')->val();

        return rtrim($this->getConfig('App.ApiPath') . '/' . $url, '/');
    }

    public function getModulesPath()
    {
        return $this->getConfig('App.ModulesPath');
    }

    public function runApp()
    {
        // If we reached this far -> pass execution to event manager
        $response = $this->eventManager()->fire('App.HandleRequest', null, '\Platform\Responses\ResponseAbstract');

        // If any event listener processed the request - send response to browser
        if(isset($response[0])) {
            $this->processResponse($response[0]);
        }

        // If none of the above happened - respond with empty output which will have debugger output attached to it
        $response = new HtmlResponse('EMPTY RESPONSE');
        $this->processResponse($response);
    }

    public function runApi()
    {
        header('Access-Control-Allow-Origin: ' . trim($this->getWebPath(), '/'));

        /**
         * REST routing
         */
        $parts = $this->_requestUrl->getPath(true)->explode('/')->filter()->values()->val();

        // Check if custom mapping exists
        $serviceClass = $this->getConfig('RestServices.' . $parts[0], false);

        Rest::setConfig($this->getConfig('Rest'));

        if(!$serviceClass) {
            // If no custom map was detected - use default routing
            $rest = Rest::initRest('Api');
            $response = $rest->processRequest()->getData();
        } else {
            // Route using custom service map
            $rest = new Rest('Api', $serviceClass);
            $response = $rest->processRequest()->getData();
        }

        /* @var $result ResponseAbstract */
        if($response instanceof JsonResponse) {
            $response->output();
        } else {
            $this->processResponse($response);
        }
        $response = new JsonResponse([], true, 'Invalid response from service!', 'invalid-response');
        $response->output();
    }

    public function prepare()
    {
        $this->_modules = $this->arr();
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
            die($e->getMessage() . ' Trying to load: <strong>' . $config->getAbsolutePath() . '</strong> in ' . __CLASS__ . ' on line ' . __LINE__);
        }

        /**
         * Error reporting
         */
        $errorReporting = $this->getConfig('App.Error.Reporting', true) ? E_ALL : 0;
        error_reporting($errorReporting);

        /**
         * Register services
         */
        foreach ($this->getConfig()->get('Services') as $sName => $sConfig) {
            ServiceManager::getInstance()->registerService($sName, $sConfig);
        }

        Storage::setConfig($this->getConfig()->get('Storage', []));

        Mongo::setConfig($this->getConfig('Mongo'));

        /**
         * Load modules
         */
        $moduleLoader = new ModuleLoader();
        $moduleLoader->loadModules();
        $this->_modules = $moduleLoader->getLoadedModules();

        /**
         * Register services, events, storage services, etc.
         */
        $this->_registerServices();

        return $this;
    }

    /**
     * @param ResponseAbstract $response
     */
    public function processResponse(ResponseAbstract $response)
    {
        $event = new Events\OutputEvent();
        $event->setOutput($response->output());
        $this->eventManager()->fire('App.RenderOutput', $event);

        // Build response body
        $responseBody = $event->getOutput();
        Response::create($responseBody)->send();
        die();
    }

    /**
     * Register services after modules were loaded
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
}