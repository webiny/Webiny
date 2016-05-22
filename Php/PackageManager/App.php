<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 * @license   http://www.webiny.com/platform/license
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
        if ($version) {
            $version = '/' . str_replace('.', '_', $version);
        } else {
            $version = '';
        }

        if ($absolute) {
            return $this->wConfig()->get('Application.AbsolutePath') . 'Apps/' . $this->name . $version;
        }

        return 'Apps/' . $this->name . $version;
    }

    public function getEntities()
    {
        $version = $this->wConfig()->get('Apps.' . $this->name);
        if ($version) {
            $version = '/' . str_replace('.', '_', $version);
        } else {
            $version = '';
        }

        $entitiesDir = $this->getName() . $version . '/Php/Entities';
        $dir = new Directory($entitiesDir, $this->wStorage('Apps'), false, '*.php');
        $entities = [];
        /* @var $file \Webiny\Component\Storage\File\File */
        foreach ($dir as $file) {
            $entityName = $this->str($file->getKey())->explode('/')->last()->replace('.php', '')->val();
            $id = $this->str($entityName)->kebabCase()->val();
            $entities[$entityName] = [
                'id'    => $id,
                'name'  => $entityName,
                'class' => 'Apps\\' . $this->str($file->getKey())->replace(['.php', $version], '')->replace('/', '\\')->val()
            ];
        }

        return $entities;
    }
}