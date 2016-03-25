<?php
namespace Apps\Core\Php\Discover\Parser;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Webiny\Component\Entity\EntityAbstract;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\Directory\Directory;

class AppParser
{
    use DevToolsTrait, StdLibTrait;

    private $name;
    private $version;
    private $slug;

    function __construct($app)
    {
        $this->name = $app;
        $this->slug = $this->str($app)->kebabCase()->val();
        $this->version = $this->wApps($app)->getVersion();
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
     * @return string
     */
    public function getVersion()
    {
        return $this->version;
    }

    /**
     * @return array
     * @throws \Webiny\Component\StdLib\StdObject\StringObject\StringObjectException
     */
    public function getEntities()
    {
        $entitiesPath = $this->wApps($this->name)->getPath(false) . '/Php/Entities';
        $storage = $this->wStorage('Root');
        $files = new Directory($entitiesPath, $storage, 0, '*.php');

        // Read all entities
        $entities = [];
        foreach ($files as $file) {
            $key = $this->str($file->getKey());
            $class = $key->replace('.php', '')->pregReplace('#/v\d+(_\d+)?#', '')->replace('/', '\\');
            // Check if abstract
            $cls = new \ReflectionClass($class->val());
            if (!$cls->isAbstract() && !$cls->isTrait()) {
                $entities[] = new EntityParser($this, $class->val());
            }
        }

        return $entities;
    }
}
