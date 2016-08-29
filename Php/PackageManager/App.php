<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\PackageManager;

use Apps\Core\Php\DevTools\Exceptions\AppException;
use Apps\Core\Php\DevTools\Interfaces\PublicApiInterface;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\Directory\Directory;
use Webiny\Component\Storage\File\File;

/**
 * Class that holds information about an application.
 */
class App extends AbstractPackage
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
    public function __construct(ConfigObject $info, $path, $type = 'app')
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

    public function getBuildPath()
    {
        $env = $this->wIsProduction() ? 'production' : 'development';

        return '/build/' . $env . '/' . $this->name . $this->getVersionPath();
    }

    public function getBuildMeta($jsApp = null)
    {
        if ($this->wIsProduction()) {
            $storage = $this->wStorage('ProductionBuild');
        } else {
            $storage = $this->wStorage('DevBuild');
        }

        $files = new Directory($this->getName(), $storage, 1, '*meta.json');
        $jsAppsMeta = [];
        /* @var $file File */
        foreach ($files as $file) {
            $data = json_decode($file->getContents(), true);
            if ($jsApp && $this->getName() . '.' . $jsApp === $data['name']) {
                return $data;
            }
            $jsAppsMeta[] = $data;
        }

        if ($jsApp) {
            throw new AppException('App "' . $this->getName() . '.' . $jsApp . '" was not found!', 'WBY-APP_NOT_FOUND');
        }

        return $jsAppsMeta;
    }

    /**
     * Get asset URL
     *
     * @param string $app JS app name
     * @param string $asset Asset path
     *
     * @return string
     */
    public function getAsset($app, $asset)
    {
        return $this->wConfig()->get('Application.WebPath') . $this->getBuildPath() . '/' . $app . '/' . $asset;
    }

    public function getEntities($withDetails = false)
    {
        $version = $this->getVersionPath();
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
        $version = $this->getVersionPath();
        $servicesDir = $this->getName() . $version . '/Php/Services';
        $dir = new Directory($servicesDir, $this->wStorage('Apps'), false, '*.php');
        $services = [];
        /* @var $file \Webiny\Component\Storage\File\File */
        foreach ($dir as $file) {
            $serviceClass = 'Apps\\' . $this->str($file->getKey())->replace(['.php', $version], '')->replace('/', '\\')->val();
            $serviceName = $this->str($file->getKey())->explode('/')->last()->replace('.php', '')->val();
            $id = $this->str($serviceClass)->replace('\\', '.')->val();
            $services[$serviceName] = [
                'id'     => $id,
                'name'   => $serviceName,
                'class'  => $serviceClass,
                'public' => $this->isInstanceOf(new $serviceClass, '\Apps\Core\Php\DevTools\Interfaces\PublicApiInterface')
            ];

            if ($withDetails) {
                $meta = $services[$serviceName]['class']::meta();
                $services[$serviceName]['methods'] = $meta['methods'] ?? [];
            }
        }

        return $services;
    }

    public function getBootstrap()
    {
        if (file_exists($this->getPath(true) . '/Php/Bootstrap.php')) {
            $class = 'Apps\\' . $this->getName() . '\\Php\\Bootstrap';
            if (in_array('Apps\Core\Php\DevTools\BootstrapTrait', class_uses($class))) {
                return new $class;
            }
        }

        return null;
    }
}