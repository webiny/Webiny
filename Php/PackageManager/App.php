<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\PackageManager;

use Webiny\Component\Config\ConfigObject;
use Webiny\Component\Storage\Directory\Directory;

/**
 * Class that holds information about an application.
 */
class App extends PackageAbstract
{
    use ParsersTrait;

    /**
     * Application base constructor.
     *
     * @param ConfigObject $info Application information object.
     * @param string       $path Absolute path to the application.
     * @param string       $type
     *
     * @throws \Exception
     */
    public function __construct(ConfigObject $info, $path, $type = "app")
    {
        parent::__construct($info, $path, $type);

        $this->name = $info->get('Name', '');
        $this->version = $info->get('Version', '');

        if ($this->name == '' || $this->version == '') {
            throw new \Exception('A component must have both name and version properties defined');
        }

        $this->parseNamespace($path);
        $this->parseEvents($info);
        $this->parseStorages($info);
        $this->parseServices($info);
        $this->parseRoutes($info);
    }

    public function getVersion()
    {
        return $this->version;
    }

    public function getPath($absolute = true)
    {
        $version = $this->wConfig()->get('Apps.' . $this->name);
        if ($version && $version !== 'root') {
            $version = '/' . str_replace('.', '_', $version);
        } else {
            $version = '';
        }

        if ($absolute) {
            return $this->wConfig()->get('Application.AbsolutePath') . 'Apps/' . $this->name . $version;
        }

        return 'Apps/' . $this->name . $version;
    }

    public function getBuildPath()
    {
        $version = $this->wConfig()->get('Apps.' . $this->name);
        if ($version && $version !== 'root') {
            $version = '/' . str_replace('.', '_', $version);
        } else {
            $version = '';
        }

        $env = $this->wIsProduction() ? 'production' : 'development';

        return '/build/' . $env . '/' . $this->name . $version;
    }

    public function getEntities($withDetails = false)
    {
        $version = $this->wConfig()->get('Apps.' . $this->name);
        if ($version && $version !== 'root') {
            $version = '/' . str_replace('.', '_', $version);
        } else {
            $version = '';
        }

        $entitiesDir = $this->getName() . $version . '/Php/Entities';
        $dir = new Directory($entitiesDir, $this->wStorage('Apps'), false, '*.php');
        $entities = [];
        /* @var $file \Webiny\Component\Storage\File\File */
        foreach ($dir as $file) {
            $entityClass = 'Apps\\' . $this->str($file->getKey())->replace(['.php', $version], '')->replace('/', '\\')->val();
            $entityName = $this->str($file->getKey())->explode('/')->last()->replace('.php', '')->val();
            $id = $this->str($entityClass)->replace('\\', '.')->val();
            $entities[$entityName] = [
                'id'    => $id,
                'name'  => $this->getName() . '.' . $entityName,
                'class' => $entityClass,
            ];

            if ($withDetails) {
                $meta = $entities[$entityName]['class']::meta();
                $entities[$entityName]['attributes'] = $meta['attributes'];
                $entities[$entityName]['methods'] = $meta['methods'];
                $entities[$entityName]['relations'] = $meta['relations'];
            }
        }

        return $entities;
    }

    public function getServices($withDetails = false)
    {
        $version = $this->wConfig()->get('Apps.' . $this->name);
        if ($version && $version !== 'root') {
            $version = '/' . str_replace('.', '_', $version);
        } else {
            $version = '';
        }

        $servicesDir = $this->getName() . $version . '/Php/Services';
        $dir = new Directory($servicesDir, $this->wStorage('Apps'), false, '*.php');
        $services = [];
        /* @var $file \Webiny\Component\Storage\File\File */
        foreach ($dir as $file) {
            $serviceClass = 'Apps\\' . $this->str($file->getKey())->replace(['.php', $version], '')->replace('/', '\\')->val();
            $serviceName = $this->str($file->getKey())->explode('/')->last()->replace('.php', '')->val();
            $id = $this->str($serviceClass)->replace('\\', '.')->val();
            $services[$serviceName] = [
                'id'    => $id,
                'name'  => $serviceName,
                'class' => $serviceClass
            ];

            if ($withDetails) {
                $meta = $services[$serviceName]['class']::meta();
                $services[$serviceName]['methods'] = $meta['methods'] ?? [];
            }
        }

        return $services;
    }
}