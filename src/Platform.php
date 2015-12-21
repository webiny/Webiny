<?php
namespace Webiny\Core;

use Ht\Lib\Inflect;
use Ht\Lib\View;
use Ht\Services\GenericService;
use Webiny\Component\Entity\Entity;
use Webiny\Component\Http\Request;
use Webiny\Component\Mailer\Mailer;
use Webiny\Component\Rest\Response\CallbackResult;
use Webiny\Component\Rest\RestException;
use Webiny\Component\Router\Router;
use Webiny\Core\Events;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\Config\ConfigTrait;
use Webiny\Component\EventManager\EventManagerTrait;
use Webiny\Component\Http\HttpTrait;
use Webiny\Component\Http\Response;
use Webiny\Component\Mongo\Mongo;
use Webiny\Component\Rest\Rest;
use Webiny\Component\Router\RouterTrait;
use Webiny\Component\Security\Security;
use Webiny\Component\ServiceManager\ServiceManager;
use Webiny\Component\ServiceManager\ServiceManagerTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\UrlObject\UrlObject;
use Webiny\Component\Storage\Storage;
use Webiny\Component\Storage\StorageTrait;
use Webiny\Component\TemplateEngine\TemplateEngine;

/**
 * Class App is responsible for booting entire app
 *
 * @package Platform
 */
final class Platform
{
    use SingletonTrait, ConfigTrait, HttpTrait, RouterTrait, StorageTrait, StdLibTrait, EventManagerTrait, ServiceManagerTrait;

    /**
     * Project root dir
     * @var string
     */
    private $rootDir;

    /**
     * @var Environment
     */
    private $environment;

    /**
     * @var ConfigObject
     */
    private $config;

    /**
     * @var UrlObject
     */
    private $requestUrl;

    /**
     * Is API request
     * @var bool
     */
    private $isApi = false;

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
            return $this->config;
        }

        return $this->config->get($key, $default);
    }

    /**
     * Get project root directory
     * @return string
     */
    public function getRootDir()
    {
        return $this->rootDir;
    }

    /**
     * Set project root directory
     *
     * @param string $dir
     *
     * @return $this
     */
    public function setRootDir($dir)
    {
        $this->rootDir = $dir;

        return $this;
    }

    /**
     * Get app environment
     *
     * @return Environment
     */
    public function getEnvironment()
    {
        return $this->environment;
    }

    public function getWebPath($url = '')
    {
        $url = $this->str($url)->trim('/')->val();

        return !$url ? $this->getConfig('Platform.WebPath') : $this->getConfig('Platform.WebPath') . '/' . $url . '/';
    }

    public function getAbsPath()
    {
        return realpath($this->getConfig('Platform.AbsPath'));
    }

    public function getApiPath($url = '')
    {
        $url = $this->str($url)->trim('/')->val();

        return $this->getWebPath() . $this->getConfig('Platform.ApiPath') . '/' . $url . '/';
    }

    public function getUserLoginWebPath($additionalParameters = '')
    {
        return $this->getWebPath($this->getConfig('Platform.UserAreaPath')) . 'login' . $additionalParameters;
    }

    public function getAdminLoginWebPath($additionalParameters = '')
    {
        return $this->getWebPath($this->getConfig('Platform.AdminAreaPath')) . 'login' . $additionalParameters;
    }

    public function setRequest(UrlObject $request)
    {
        $this->requestUrl = $request;

        return $this;
    }

    /**
     * Is it an API request?
     *
     * @return bool
     */
    public function isApi()
    {
        return $this->isApi;
    }

    /**
     * Loop through available Apps and check if any of them can route the requested route.
     * If not, trigger 'Platform.HandleRequest' event to see if some custom handling exists.
     */
    public function runApp()
    {
        $this->config->mergeWith($this->config()->yaml($this->rootDir . '/Configs/Platform/Router.yaml'));
        // Configure router and check custom routes
        Router::setConfig($this->config->get('Router'));

        $result = $this->router()->match($this->requestUrl);
        if ($result) {
            $routeResult = $this->router()->execute($result);
            Response::create($routeResult)->send();
        }

        $response = $this->eventManager()->fire('Platform.HandleRequest');

        // If any event listener processed the request - send response to browser
        if (isset($response[0])) {
            $responseBody = $this->processResponse($response[0]);
            Response::create($responseBody)->send();
        }

        // If none of the above happened - respond with empty output
        Response::create('Sheesh...didn\'t get to render anything :(')->send();
    }

    public function runApi()
    {
        $this->isApi = true;
        $restResponse = null;

        /**
         * REST routing
         */
        Rest::setConfig($this->getConfig('Rest'));

        try {
            $rest = Rest::initRest('Api');
            $restResponse = $rest->processRequest();
        } catch (RestException $e) {
            // Try creating dynamic service class
            $requestedServiceClass = $e->getRequestedClass();
            if ($requestedServiceClass) {
                $inflector = new Inflect();
                $entityName = $this->str($requestedServiceClass)->replace('\Ht\Services\\', '')->val();
                if(!$this->str($entityName)->endsWith('ss')){
                    $entityName = $inflector->singularize($entityName);
                }

                // If something went wrong during the construction of GenericService, catch the error and output that
                try {
                    $service = new GenericService('\Ht\Entities\\' . $entityName, $requestedServiceClass);
                    $rest = new Rest('Api', $service);
                    $restResponse = $rest->processRequest();
                } catch (RestException $e) {
                    $restResponse = new CallbackResult();
                    $restResponse->setHeaderResponse(404)->setErrorResponse($e->getMessage());
                }
            }
        } finally {
            $this->outputRestResponse($restResponse);
        }
    }

    /**
     * @param CallbackResult $restResponse
     */
    private function outputRestResponse(CallbackResult $restResponse)
    {
        if ($restResponse->getError()) {
            $restResponse->sendOutput();
        }

        $serviceResponse = $restResponse->getData();
        if ($this->isString($serviceResponse)) {
            $restResponse->setData($this->processResponse($serviceResponse));
        }

        $restResponse->sendOutput();
    }

    /**
     * Load platform config and active Apps
     * @return $this
     * @throws \Exception
     * @throws \Webiny\Component\ServiceManager\ServiceManagerException
     * @throws \Webiny\Component\StdLib\Exception\Exception
     */
    public function prepare()
    {
        // Load basic config to load initial values
        $this->config = $this->config()->yaml($this->rootDir . '/Configs/Platform/Base.yaml');

        /**
         * Determine environment
         */
        $this->environment = new Environment($this->requestUrl);
        $envConfig = $this->environment->getConfig();
        $this->config->mergeWith($envConfig);

        // Load config again, but do it using custom ConfigLoader to replace placeholders with real values
        $this->config = ConfigLoader::getInstance()->yaml($this->rootDir . '/Configs/Platform/Base.yaml');

        // Merge env config into final platform config again
        $this->config->mergeWith($envConfig);

        /**
         * Error reporting
         */
        $errorReporting = $this->getConfig('Platform.ErrorReporting', true) ? E_ALL : 0;
        error_reporting($errorReporting);

        /**
         * Register services
         */
        foreach ($this->getConfig()->get('Services', []) as $sName => $sConfig) {
            ServiceManager::getInstance()->registerService($sName, $sConfig);
        }

        Storage::setConfig($this->getConfig()->get('Storage', []));
        Mailer::setConfig($this->getConfig()->get('Mailer', []));
        Mongo::setConfig($this->getConfig('Mongo'));
        Entity::setConfig($this->getConfig('Entity'));
        Security::setConfig($this->getConfig('Security'));
        TemplateEngine::setConfig($this->getConfig('TemplateEngine'));

        /**
         * Register event listeners
         */
        foreach ($this->getConfig('Events', []) as $eventName => $listeners) {
            foreach ($listeners as $listener) {
                $this->eventManager()
                     ->listen($eventName)
                     ->handler($listener->get('Handler'))
                     ->method($listener->get('Method', 'handle'))
                     ->priority($listener->get('Priority', 300));
            }
        }

        return $this;
    }

    /**
     * @param mixed $response
     *
     * @return mixed
     */
    public function processResponse($response)
    {
        $event = new Events\OutputEvent();
        $event->setOutput($response);
        $this->eventManager()->fire('Platform.RenderOutput', $event);
        $this->eventManager()->fire('Platform.BeforeSendOutput', $event);

        return $event->getOutput();
    }
}