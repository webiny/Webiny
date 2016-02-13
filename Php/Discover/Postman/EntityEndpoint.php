<?php
namespace Apps\Core\Php\Discover\Postman;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\Lib\Inflect;
use Webiny\Component\StdLib\StdLibTrait;

class EntityEndpoint
{
    use DevToolsTrait, StdLibTrait;

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
        $this->class = $entity;
        $this->entityName = $this->str($entity)->explode('\\')->last()->val();
        $this->entitySlug = $this->str($this->entityName)->kebabCase()->val();
        $this->inflect = new Inflect();

        $this->generate();
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
        // Generate CRUD requests
        $crudGetId = uniqid('crud-get-');

        $this->requests[] = [
            'id'      => $crudGetId,
            'headers' => 'Authorization:{{authorization}}',
            'url'     => '{{url}}/api/entities/' . $this->appSlug . '/' . $this->entitySlug,
            'method'  => 'GET',
            'data'    => [],
            'name'    => 'List ' . $this->inflect->pluralize($this->entityName),
            'time'    => time(),
            'version' => '' . $this->appVersion
        ];

        $this->order[] = $crudGetId;

        $this->folder = [
            'id'          => uniqid('folder-'),
            'name'        => $this->entityName,
            'description' => '',
            'order'       => $this->order
        ];
    }
}
