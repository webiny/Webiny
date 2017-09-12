<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\Apps;

use Apps\Webiny\Php\Lib\Interfaces\PublicApiInterface;
use Apps\Webiny\Php\Lib\LifeCycle\LifeCycleInterface;
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

    public function getPath($absolute = true)
    {
        if ($absolute) {
            return $this->wConfig()->get('Application.AbsolutePath') . 'Apps/' . $this->name;
        }

        return 'Apps/' . $this->name;
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
        $builtInClass = 'Apps\Webiny\Php\Lib\LifeCycle\\' . $name;
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