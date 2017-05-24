<?php
namespace Apps\Webiny\Php\Discover;

use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\PackageManager\Parser\EntityParser;
use Apps\Webiny\Php\PackageManager\Parser\ServiceParser;
use Apps\Webiny\Php\Discover\Postman\EndPoint;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

class Postman
{
    use WebinyTrait, StdLibTrait;

    public function generate($appName)
    {
        $collectionId = StringObject::uuid();
        $collectionName = 'Webiny ' . $appName;

        $folders = [];
        $requests = [];

        $app = $this->wApps($appName);

        foreach ($app->getEntities() as $entity) {
            $order = [];
            $entityParser = new EntityParser($entity['class']);
            foreach ($entityParser->getApiMethods() as $method) {
                $endpoint = new EndPoint($app, $method);
                $request = $endpoint->getRequest();
                $requests[] = $request;
                $order[] = $request['id'];
            }

            // Each Entity is stored in its own folder
            $folders[] = [
                'id'          => StringObject::uuid(),
                'name'        => '(E) ' . $entityParser->getName(),
                'description' => '',
                'order'       => $order
            ];
        }

        foreach ($app->getServices() as $service) {
            $order = [];
            $serviceParser = new ServiceParser($service['class']);
            foreach ($serviceParser->getApiMethods() as $method) {
                $endpoint = new EndPoint($app, $method);
                $request = $endpoint->getRequest();
                $requests[] = $request;
                $order[] = $request['id'];
            }

            // Each Service is stored in its own folder
            $folders[] = [
                'id'          => StringObject::uuid(),
                'name'        => '(S) ' . $serviceParser->getName(),
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
            'description' => 'Webiny ' . $appName . ' API docs',
            'order'       => [],
            'timestamp'   => time(),
            'owner'       => 0,
            'requests'    => $requests,
            'folders'     => $folders
        ];
    }
}
