<?php
namespace Apps\Core\Php\Lib;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Webiny\Component\Storage\Directory\Directory;

class PostmanDocs
{
    use DevToolsTrait;

    public function generate()
    {
        $collectionId = uniqid();

        $entitiesPath = $this->wApps('Core')->getPath(false) . '/Php/Entities';
        $storage = $this->wStorage('Root');

        $files = new Directory($entitiesPath, $storage, 1);

        $entities = [];
        foreach ($files as $file) {
            $entities[] = $file->getKey();
        }

        return $entities;

        return [
            'id'          => $collectionId,
            'name'        => 'Webiny Core',
            'description' => 'Webiny Core API docs',
            'order'       => [],
            'timestamp'   => time(),
            'owner'       => 0,
            'requests'    => [],
            'folders'     => []
        ];
    }
}
