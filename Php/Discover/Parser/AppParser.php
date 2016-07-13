<?php
namespace Apps\Core\Php\Discover\Parser;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Webiny\Component\StdLib\StdLibTrait;

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
        // Read all entities
        $entities = [];
        foreach ($this->wApps($this->name)->getEntities() as $entity) {
            $class = $entity['class'];
            // Check if abstract
            $cls = new \ReflectionClass($class);
            if (!$cls->isAbstract() && !$cls->isTrait()) {
                $entities[] = new EntityParser($this, $class);
            }
        }

        return $entities;
    }

    /**
     * @return array
     * @throws \Webiny\Component\StdLib\StdObject\StringObject\StringObjectException
     */
    public function getServices()
    {
        // Read all services
        $services = [];
        foreach ($this->wApps($this->name)->getServices() as $service) {
            $class = $service['class'];
            // Check if abstract
            $cls = new \ReflectionClass($class);
            if (!$cls->isAbstract() && !$cls->isTrait()) {
                $services[] = new ServiceParser($this, $class);
            }
        }

        return $services;
    }
}
