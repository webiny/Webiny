<?php
namespace Apps\Core\Php\Discover;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\Discover\Parser\AppParser;
use Apps\Core\Php\Discover\Parser\EntityParser;
use Apps\Core\Php\Discover\Parser\ServiceParser;
use Apps\Core\Php\Discover\Postman\EndPoint;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

class Postman
{
    use WebinyTrait, StdLibTrait;

    public function generate(AppParser $app)
    {
        $collectionId = StringObject::uuid();
        $collectionName = 'Webiny ' . $app->getName();

        $folders = [];
        $requests = [];

        /* @var $entity EntityParser */
        foreach ($app->getEntities() as $entity) {
            $order = [];
            foreach ($entity->getApiMethods() as $method) {
                $endpoint = new EndPoint($entity, $method);
                $request = $endpoint->getRequest();
                $requests[] = $request;
                $order[] = $request['id'];
            }

            // Each Entity is stored in its own folder
            $folders[] = [
                'id'          => StringObject::uuid(),
                'name'        => '(E) ' . $entity->getName(),
                'description' => '',
                'order'       => $order
            ];
        }

        /* @var $service ServiceParser */
        foreach ($app->getServices() as $service) {
            $order = [];
            foreach ($service->getApiMethods() as $method) {
                $endpoint = new EndPoint($service, $method);
                $request = $endpoint->getRequest();
                $requests[] = $request;
                $order[] = $request['id'];
            }

            // Each Service is stored in its own folder
            $folders[] = [
                'id'          => StringObject::uuid(),
                'name'        => '(S) ' . $service->getName(),
                'description' => '',
                'order'       => $order
            ];
        }

        foreach ($requests as $index => $r) {
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
