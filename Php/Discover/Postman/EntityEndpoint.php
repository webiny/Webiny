<?php
namespace Apps\Core\Php\Discover\Postman;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

class EntityEndPoint
{
    use DevToolsTrait, StdLibTrait;

    private $app;
    private $appVersion;
    private $appSlug;
    private $entityClass;
    private $entityName;
    private $entitySlug;
    private $requests = [];
    private $folder = [];
    private $order = [];

    function __construct($app, $entity)
    {
        $this->app = $app;
        $this->appSlug = $this->str($app)->kebabCase()->val();
        $this->appVersion = $this->wApps($app)->getVersion();
        $this->entityClass = $entity;
        $this->entityName = $this->str($entity)->explode('\\')->last()->val();
        $this->entitySlug = $this->str($this->entityName)->kebabCase()->pluralize()->val();

        $this->generate();
    }

    /**
     * @return mixed
     */
    public function getApp()
    {
        return $this->app;
    }

    /**
     * @return mixed
     */
    public function getAppSlug()
    {
        return $this->appSlug;
    }

    /**
     * @return mixed|string|\Webiny\Component\Config\ConfigObject
     */
    public function getAppVersion()
    {
        return $this->appVersion;
    }

    /**
     * @return mixed
     */
    public function getEntityClass()
    {
        return $this->entityClass;
    }

    /**
     * @return mixed
     */
    public function getEntityName()
    {
        return $this->entityName;
    }

    /**
     * @return mixed
     */
    public function getEntitySlug()
    {
        return $this->entitySlug;
    }

    public function getRequests()
    {
        return $this->requests;
    }

    public function getFolder()
    {
        return $this->folder;
    }

    private function generate()
    {
        $endPoints = [
            new CrudList($this),
            new CrudGet($this),
            new CrudDelete($this),
            new CrudCreate($this),
            new CustomMethods($this)
        ];

        /* @var $ep AbstractEndPoint */
        foreach ($endPoints as $ep) {
            foreach ($ep->getRequests() as $r) {
                $this->requests[] = $r;
                $this->order[] = $r['id'];
            }
        }

        $this->folder = [
            'id'          => StringObject::uuid(),
            'name'        => $this->entityName,
            'description' => '',
            'order'       => $this->order
        ];
    }
}
