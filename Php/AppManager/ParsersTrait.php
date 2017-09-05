<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\AppManager;

use Webiny\Component\Config\ConfigObject;
use Webiny\Component\StdLib\StdLibTrait;
use Apps\Webiny\Php\DevTools\WebinyTrait;
use Webiny\Component\Storage\Storage;

/**
 * Description
 */
trait ParsersTrait
{
    use StdLibTrait, WebinyTrait;

    private $namespace;

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
    private function parseEvents(ConfigObject $info)
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
    private function parseStorages(ConfigObject $info)
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

    private function addListener($eventName, $callback)
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
    private function parseRoutes(ConfigObject $info)
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
    private function parseServices(ConfigObject $info)
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
}
