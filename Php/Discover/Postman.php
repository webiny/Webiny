<?php
namespace Apps\Core\Php\Discover;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\Discover\Parser\AppParser;
use Apps\Core\Php\Discover\Parser\EntityParser;
use Apps\Core\Php\Discover\Postman\EntityEndPoint;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

class Postman
{
    use DevToolsTrait, StdLibTrait;

    public function generate(AppParser $app)
    {
        $collectionId = StringObject::uuid();
        $collectionName = 'Webiny ' . $app->getName();

        $folders = [];
        $requests = [];

        /* @var $entity EntityParser */
        foreach ($app->getEntities() as $entity) {
            $order = [];
            foreach($entity->getApiMethods() as $method){
                $endpoint = new EntityEndPoint($entity, $method);
                $request = $endpoint->getRequest();
                $requests[] = $request;
                $order[] = $request['id'];
            }

            // Each Entity is stored in its own folder
            $folders[] = [
                'id'          => StringObject::uuid(),
                'name'        => $entity->getName(),
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
            'description' => 'Webiny ' . $app->getName() . ' API docs',
            'order'       => [],
            'timestamp'   => time(),
            'owner'       => 0,
            'requests'    => $requests,
            'folders'     => $folders
        ];
    }
}
