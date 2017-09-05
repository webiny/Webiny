<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\Apps;

use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\StdLib\StdLibTrait;
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
     * @var string Path to the package (relative to application root).
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
     * Base constructor.
     *
     * @param ConfigObject $config Package information.
     * @param string       $path Path to the package (relative to app root).
     *
     * @throws \Exception
     */
    public function __construct(ConfigObject $config, $path)
    {
        $this->populateProperties($config);
        $this->config = $config;
        $this->path = $path;
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
     * @return string
     */
    public function getPath()
    {
        return $this->path;
    }

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
}