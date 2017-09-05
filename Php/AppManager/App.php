<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\AppManager;

use Apps\Webiny\Php\DevTools\LifeCycle\LifeCycleInterface;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\Storage\Directory\Directory;

/**
 * Class that holds information about an application.
 */
class App extends AbstractApp
{
    /**
     * Application base constructor.
     *
     * @param ConfigObject $info Application information object.
     * @param string       $path Absolute path to the application.
     *
     * @throws \Exception
     */
    public function __construct(ConfigObject $info, $path)
    {
        parent::__construct($info, $path);
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

    public function getVersion()
    {
        return $this->version;
    }

    public function getVersionPath()
    {
        $version = $this->wConfig()->get('Apps.' . $this->name);
        if ($version && !is_bool($version)) {
            $version = '/v' . str_replace('.', '_', $version);
        } else {
            $version = '';
        }

        return $version;
    }

    public function getPath($absolute = true)
    {
        $version = $this->getVersionPath();
        if ($absolute) {
            return $this->wConfig()->get('Application.AbsolutePath') . 'Apps/' . $this->name . $version;
        }

        return 'Apps/' . $this->name . $version;
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

    public function getEntities()
    {
        $version = $this->getVersionPath();
        $entitiesDir = $this->getName() . $version . '/Php/Entities';
        $dir = new Directory($entitiesDir, $this->wStorage('Apps'), false, '*.php');
        $entities = [];
        /* @var $file \Webiny\Component\Storage\File\File */
        foreach ($dir as $file) {
            $entityClass = 'Apps\\' . $this->str($file->getKey())->replace(['.php', $version], '')->replace('/', '\\')->val();
            $entityName = $this->str($file->getKey())->explode('/')->last()->replace('.php', '')->val();

            // Check if abstract or trait
            $cls = new \ReflectionClass($entityClass);
            if (!$cls->isAbstract() && !$cls->isTrait()) {
                $entities[$entityName] = [
                    'app'   => $this->getName(),
                    'name'  => $this->getName() . '.' . $entityName,
                    'class' => $entityClass,
                ];
            }
        }

        return $entities;
    }

    public function getServices()
    {
        $version = $this->getVersionPath();
        $servicesDir = $this->getName() . $version . '/Php/Services';
        $dir = new Directory($servicesDir, $this->wStorage('Apps'), false, '*.php');
        $services = [];
        /* @var $file \Webiny\Component\Storage\File\File */
        foreach ($dir as $file) {
            $serviceClass = 'Apps\\' . $this->str($file->getKey())->replace(['.php', $version], '')->replace('/', '\\')->val();
            $serviceName = $this->str($file->getKey())->explode('/')->last()->replace('.php', '')->val();
            // Check if abstract
            $cls = new \ReflectionClass($serviceClass);
            if (!$cls->isAbstract()) {
                $interfaces = class_implements($serviceClass);
                $public = in_array('Apps\Webiny\Php\DevTools\Interfaces\PublicApiInterface', $interfaces);

                $services[$serviceName] = [
                    'app'           => $this->getName(),
                    'name'          => $serviceName,
                    'class'         => $serviceClass,
                    'public'        => $public,
                    'authorization' => !$public
                ];
            }
        }

        return $services;
    }

    /**
     * Get instance of a lifecycle object: Bootstrap, Install or Release
     *
     * @param string $name Life cycle object name
     *
     * @return LifeCycleInterface
     */
    public function getLifeCycleObject($name)
    {
        $builtInClass = 'Apps\Webiny\Php\DevTools\LifeCycle\\' . $name;
        if (file_exists($this->getPath(true) . '/Php/' . $name . '.php')) {
            $class = 'Apps\\' . $this->getName() . '\\Php\\' . $name;
            if (in_array($builtInClass, class_parents($class))) {
                return new $class;
            }
        }

        return new $builtInClass();
    }

    private function registerAutoloaderMap()
    {
        $this->wClassLoader()->appendLibrary('Apps\\' . $this->name . '\\', $this->getPath());
    }
}