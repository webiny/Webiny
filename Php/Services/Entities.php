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
            $withDetails = $this->wRequest()->query('withDetails', false);
            $entities = [];
            /* @var $app App */
            foreach ($this->wApps() as $app) {
                foreach($app->getEntities($withDetails) as $entity){
                    $entities[] = $entity;
                }
            }
            
            return $entities;
        });

        $this->api('get', 'attributes', function () {
            $entityClass = $this->wRequest()->query('entity');
            $instance = new $entityClass;
            return $instance->meta()['attributes'];
        });

        $this->api('get', 'methods', function () {
            $entityClass = $this->wRequest()->query('entity');
            $instance = new $entityClass;
            return $instance->meta()['methods'];
        });
    }
}