<?php

namespace Apps\Core\Php\Services;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Services\AbstractService;
use Apps\Core\Php\PackageManager\App;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class Entities
 * @package Apps\Core\Php\Services
 */
class Entities extends AbstractService
{
    use DevToolsTrait, StdLibTrait;

    function __construct()
    {
        $this->api('get', '/', function () {
            $entities = [];
            /* @var $app App */
            foreach ($this->wApps() as $app) {
                $entities = array_merge($entities, array_values($app->getEntities()));
            }

            return $entities;
        });

        $this->api('get', 'attributes', function () {
            $entityClass = $this->wRequest()->query('entity');
            $instance = new $entityClass;
            return $instance->meta()['attributes'];
        });
    }
}