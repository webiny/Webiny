<?php
namespace Apps\Core\Php\Discover;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\Discover\Parser\EntityParser;
use Apps\Core\Php\Discover\Postman\EntityEndPoint;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;
use Webiny\Component\Storage\Directory\Directory;

class Postman
{
    use DevToolsTrait, StdLibTrait;

    public function generate($app = 'Core')
    {
        $collectionId = StringObject::uuid();
        $collectionName = 'Webiny ' . $app;

        $entitiesPath = $this->wApps($app)->getPath(false) . '/Php/Entities';
        $storage = $this->wStorage('Root');

        $files = new Directory($entitiesPath, $storage, 1);

        // Read all entities
        $entities = [];
        foreach ($files as $file) {
            $key = $this->str($file->getKey());
            $class = $key->replace('.php', '')->pregReplace('#/v\d+(_\d+)?#', '')->replace('/', '\\');
            $entities[] = $class->val();
        }

        $folders = [];
        $requests = [];

        // Generate API requests for each entity
        foreach ($entities as $entity) {
            $parser = new EntityParser($app, $entity);
            $order = [];
            foreach($parser->getEntityApiMethods() as $method){
                $endpoint = new EntityEndPoint($parser, $method);
                $request = $endpoint->getRequest();
                $requests[] = $request;
                $order[] = $request['id'];
            }

            // Each Entity is stored in its own folder
            $folders[] = [
                'id'          => StringObject::uuid(),
                'name'        => $parser->getEntityName(),
                'description' => '',
                'order'       => $order
            ];
        }

        foreach($requests as $index => $r){
            $requests[$index]['collectionId'] = $collectionId;
        }

        return [
            'id'          => $collectionId,
            'name'        => $collectionName,
            'description' => 'Webiny ' . $app . ' API docs',
            'order'       => [],
            'timestamp'   => time(),
            'owner'       => 0,
            'requests'    => $requests,
            'folders'     => $folders
        ];
    }
}
