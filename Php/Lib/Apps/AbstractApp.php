<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\Apps;

use Apps\Webiny\Php\Lib\Interfaces\PublicApiInterface;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\Directory\Directory;
use Webiny\Component\Storage\Storage;

/**
 * Holds information about the defined package.
 */
abstract class AbstractApp
{
    use WebinyTrait, StdLibTrait;

    /**
     * @var string Name of the package.
     */
    protected $name;

    /**
     * @var string Package version.
     */
    protected $version;

    /**
     * @var string Link to the package on Webiny Store.
     */
    private $link;

    /**
     * @var string Package description.
     */
    protected $description;

    /**
     * @var string Author name.
     */
    protected $authorName;

    /**
     * @var string Link to authors website.
     */
    protected $authorLink;

    /**
     * @var string Authors email.
     */
    protected $authorEmail;

    /**
     * @var string Path to the app (relative to application root).
     */
    protected $path;

    /**
     * @var string Can be 'app' or 'plugin'.
     */
    protected $type;

    /**
     * Package config object
     *
     * @var ConfigObject
     */
    protected $config;

    private $namespace;

    /**
     * Bootstrap procedure
     *
     * @return void
     */
    abstract public function bootstrap();

    /**
     * Install procedure
     *
     * @return void
     */
    abstract public function install();

    /**
     * Release procedure
     *
     * @return void
     */
    abstract public function release();

    /**
     * Get array of user roles data
     * @return array
     */
    abstract public function getUserRoles();

    /**
     * Get array of user role groups data
     * @return array
     */
    abstract public function getUserRoleGroups();

    /**
     * Get array of user permissions data
     * @return array
     */
    abstract public function getUserPermissions();

    /**
     * Application constructor.
     *
     * @param ConfigObject $info Application information object.
     * @param string       $path Relative path to the application.
     *
     * @throws \Exception
     */
    public function __construct(ConfigObject $info, $path)
    {
        $this->populateProperties($info);
        $this->path = $path;
        $this->config = $info;
        $this->name = $info->get('Name', '');
        $this->version = $info->get('Version', '');

        if ($this->name == '' || $this->version == '') {
            throw new \Exception('A component must have both name and version properties defined');
        }

        $this->registerAutoloaderMap();
        $this->parseNamespace($path);
        $this->parseEvents($info);
        $this->parseStorages($info);
        $this->parseServices($info);
        $this->parseRoutes($info);
    }

    /**
     * Get app name.
     * @return string App name.
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Get package config
     *
     * @return ConfigObject
     */
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * Get link to the package on Webiny Store.
     *
     * @return string Url
     */
    public function getLink()
    {
        return $this->link;
    }

    /**
     * Version number.
     *
     * @return string Version number.
     */
    public function getVersion()
    {
        return $this->version;
    }

    /**
     * Short package description.
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Author name.
     *
     * @return string
     */
    public function getAuthorName()
    {
        return $this->authorName;
    }

    /**
     * Get the link to the author website.
     *
     * @return string
     */
    public function getAuthorLink()
    {
        return $this->authorLink;
    }

    /**
     * Get author email.
     *
     * @return string
     */
    public function getAuthorEmail()
    {
        return $this->authorEmail;
    }

    /**
     * Get the path to the component. Path is relative to the app root.
     *
     * @param bool $absolute
     *
     * @return string
     */
    public function getPath($absolute = true)
    {
        if ($absolute) {
            return $this->wConfig()->get('Application.AbsolutePath') . $this->path;
        }

        return $this->path;
    }

    public function getEntities()
    {
        $entitiesDir = $this->getName() . '/Php/Entities';
        $dir = new Directory($entitiesDir, $this->wStorage('Apps'), false, '*.php');
        $entities = [];
        /* @var $file \Webiny\Component\Storage\File\File */
        foreach ($dir as $file) {
            $entityClass = 'Apps\\' . $this->str($file->getKey())->replace('.php', '')->replace('/', '\\')->val();
            $entityName = $this->str($file->getKey())->explode('/')->last()->replace('.php', '')->val();

            // Check if abstract or trait
            $cls = new \ReflectionClass($entityClass);
            if (!$cls->isAbstract() && !$cls->isTrait()) {
                $entities[$entityName] = [
                    'app'     => $this->getName(),
                    'name'    => $this->getName() . '.' . $entityName,
                    'class'   => $entityClass,
                    'classId' => $entityClass::getClassId()
                ];
            }
        }

        return $entities;
    }

    public function getServices()
    {
        $servicesDir = $this->getName() . '/Php/Services';
        $dir = new Directory($servicesDir, $this->wStorage('Apps'), false, '*.php');
        $services = [];
        /* @var $file \Webiny\Component\Storage\File\File */
        foreach ($dir as $file) {
            $serviceClass = 'Apps\\' . $this->str($file->getKey())->replace('.php', '')->replace('/', '\\')->val();
            $serviceName = $this->str($file->getKey())->explode('/')->last()->replace('.php', '')->val();
            // Check if abstract
            $cls = new \ReflectionClass($serviceClass);
            if (!$cls->isAbstract()) {
                $interfaces = class_implements($serviceClass);
                $public = in_array(PublicApiInterface::class, $interfaces);

                $services[$serviceName] = [
                    'app'           => $this->getName(),
                    'name'          => $serviceName,
                    'class'         => $serviceClass,
                    'classId'       => $serviceClass::getClassId(),
                    'public'        => $public,
                    'authorization' => !$public
                ];
            }
        }

        return $services;
    }

    /**
     * Get a single JsApp or an array of all JS apps from current Webiny app
     *
     * @param null $jsApp
     *
     * @return JsApp|array
     */
    public function getJsApps($jsApp = null)
    {
        $storage = $this->wStorage('Apps');
        $directory = new Directory($this->getName() . '/Js', $storage, 0);
        $jsApps = [];
        /* @var $dir Directory */
        foreach ($directory as $dir) {
            if ($dir instanceof Directory) {
                $jsAppInstance = new JsApp($this, $dir);
                if ($jsApp) {
                    if ($jsAppInstance->getName() == $jsApp) {
                        return $jsAppInstance;
                    }
                } else {
                    $jsApps[] = $jsAppInstance;
                }
            }
        }

        return $jsApps;
    }

    public function getBuildMeta($jsApp = null)
    {
        $meta = [];
        foreach ($this->getJsApps() as $app) {
            if ($jsApp && $app->getName() == $jsApp) {
                return $app->getBuildMeta();
            }

            $meta[] = $app->getBuildMeta();
        }

        return $meta;
    }

    /****************************************************************************************/
    /* Parsing methods
    /****************************************************************************************/

    /**
     * Parses the class namespace based on its path.
     *
     * @param string $path Path to the class.
     */
    protected function parseNamespace($path)
    {
        $this->namespace = $this->str($path)->replace(DIRECTORY_SEPARATOR, '\\')->val();
    }

    /**
     * Parses and registers events attached to the component.
     *
     * Greater Priority number means handler will be executed first (or sooner).
     *
     * @param ConfigObject $info Parsed App.yaml ConfigObject.
     */
    protected function parseEvents(ConfigObject $info)
    {
        $eventConfig = $info->get('Events', [], true);
        foreach ($eventConfig as $eventGroupName => $eventGroups) {
            foreach ($eventGroups as $subGroupName => $subGroupEvents) {
                $eventName = $eventGroupName . '.' . $subGroupName;
                foreach ($subGroupEvents as $eName => $callback) {
                    $sEventName = $eventName . '.' . $eName;

                    // If single callback
                    if (is_string($callback)) {
                        $this->addListener($sEventName, $callback);
                        continue;
                    }

                    // If multiple callbacks provided...
                    foreach ($callback as $c) {
                        $this->addListener($sEventName, $c);
                    }
                }
            }
        }
    }

    /**
     * Parses and registers storages attached to the component.
     *
     * @param ConfigObject $info Parsed App.yaml ConfigObject.
     */
    protected function parseStorages(ConfigObject $info)
    {
        // Set global storage config
        Storage::setConfig($info->get('Storage', new ConfigObject()));

        // Check if there is a per-environment storage defined and append it to the existing config
        $key = 'Development';
        if ($this->wIsProduction()) {
            $key = 'Production';
        }

        $envStorage = $info->get($key . '.Storage');
        if ($envStorage) {
            Storage::appendConfig($envStorage);
        }
    }

    protected function addListener($eventName, $callback)
    {
        if (is_string($callback)) {
            $callback = $this->str($callback)->replace('/', '\\');
            $priority = 300;
        } else {
            $priority = $callback['Priority'] ?? 300;
            $callback = $this->str($callback['Handler'])->replace('/', '\\');
        }

        if (!$callback->contains('::')) {
            $callback->append('::handle');
        }

        if ($callback->startsWith('\\')) {
            $this->wEvents()->listen($eventName, $callback->val(), $priority);
        } else {
            $this->wEvents()->listen($eventName, $this->namespace . '\\' . $callback->val(), $priority);
        }
    }

    /**
     * Parses and registers routes attached to the component.
     *
     * @param ConfigObject $info Parsed App.yaml ConfigObject.
     */
    protected function parseRoutes(ConfigObject $info)
    {
        $routes = $info->get('Routes', false);
        if ($routes) {
            foreach ($routes as $key => $route) {

                if (is_string($route['Callback'])) {
                    $route['Callback'] = new ConfigObject([
                        'Class'  => $route['Callback'],
                        'Method' => 'handle'
                    ]);
                }

                $callback = $this->str($route['Callback']['Class']);
                if (!$callback->startsWith('\\')) {
                    $route['Callback']['Class'] = $this->namespace . '\\' . $callback->replace('/', '\\')->val();
                }
            }
            $this->wRouter()->registerRoutes($routes);
        }
    }

    /**
     * Parses and registers services attached to the component.
     *
     * @param ConfigObject $info Parsed App.yaml ConfigObject.
     */
    protected function parseServices(ConfigObject $info)
    {
        // Register global services
        $globalServices = $info->get('Services', []);
        foreach ($globalServices as $sName => $sConfig) {
            $this->wService()->registerService($sName, $sConfig);
        }

        // Check if there are some per-environment services and register those aswell
        $key = 'Development';
        if ($this->wIsProduction()) {
            $key = 'Production';
        }
        $environmentServices = $info->get($key . '.Services', []);
        foreach ($environmentServices as $sName => $sConfig) {
            $this->wService()->registerService($sName, $sConfig);
        }
    }

    /**
     * Populates object properties from the provided ConfigObject.
     *
     * @param ConfigObject $data Object from which to thake the properties.
     */
    private function populateProperties(ConfigObject $data)
    {
        $properties = get_object_vars($this);

        foreach ($properties as $k => $v) {
            $pName = ucfirst(substr($k, 1));
            if (property_exists($this, $k)) {
                $this->$k = $data->get($pName, '');
            }
        }
    }

    private function registerAutoloaderMap()
    {
        $this->wClassLoader()->appendLibrary('Apps\\' . $this->name . '\\', $this->getPath());
    }
}