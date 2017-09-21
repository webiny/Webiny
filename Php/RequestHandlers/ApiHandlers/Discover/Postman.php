<?php

namespace Apps\Webiny\Php\RequestHandlers\ApiHandlers\Discover;

use Apps\Webiny\Php\Lib\WebinyTrait;
use Apps\Webiny\Php\Lib\Apps\Parser\EntityParser;
use Apps\Webiny\Php\Lib\Apps\Parser\ServiceParser;
use Apps\Webiny\Php\RequestHandlers\ApiHandlers\Discover\Postman\EndPoint;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

class Postman
{
    use WebinyTrait, StdLibTrait;

    public function generate($appName)
    {
        $collectionId = StringObject::uuid();
        $collectionName = $appName;

        $folders = [];
        $requests = [];

        $app = $this->wApps($appName);

        foreach ($app->getEntities() as $entity) {
            $order = [];
            $entityParser = new EntityParser($entity['class']);
            foreach ($entityParser->getApiMethods() as $method) {
                if (!$this->wAuth()->canExecute($entity['class'], $method['key'])) {
                    continue;
                }
                $endpoint = new EndPoint($app, $method);
                $request = $endpoint->getRequest();
                $requests[] = $request;
                $order[] = $request['id'];
            }

            if (!count($order)) {
                continue;
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
                if (!$this->wAuth()->canExecute($service['class'], $method['key'])) {
                    continue;
                }
                $endpoint = new EndPoint($app, $method);
                $request = $endpoint->getRequest();
                $requests[] = $request;
                $order[] = $request['id'];
            }

            if (!count($order)) {
                continue;
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
            'description' => $appName . ' API docs',
            'order'       => [],
            'timestamp'   => time(),
            'owner'       => 0,
            'requests'    => $requests,
            'folders'     => $folders
        ];
    }
}
