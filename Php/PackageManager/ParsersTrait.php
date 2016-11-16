<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\PackageManager;

use Webiny\Component\Config\ConfigObject;
use Webiny\Component\ServiceManager\ServiceManager;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObjectTrait;
use Apps\Core\Php\DevTools\WebinyTrait;
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
        Storage::setConfig($info->get('Storage', new ConfigObject()));
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
                        'Class' => $route['Callback'],
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
        $services = $info->get('Services', []);
        foreach ($services as $sName => $sConfig) {
            $this->wService()->registerService($sName, $sConfig);
        }
    }
}
