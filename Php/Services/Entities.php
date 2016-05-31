<?php

namespace Apps\Core\Php\Services;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;
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
        /**
         * @api.name List all entities registered in the system
         * @api.query.withDetails boolean Return full details (default: false)
         */
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

        /**
         * @api.name Get entity attributes
         * @api.query.entity string Entity class for which to get attributes
         */
        $this->api('get', 'attributes', function () {
            $entityClass = $this->wRequest()->query('entity');
            /* @var $instance EntityAbstract */
            $instance = new $entityClass;
            return $instance->meta()['attributes'];
        });

        /**
         * @api.name Get entity methods
         * @api.query.entity string Entity class for which to get methods
         */
        $this->api('get', 'methods', function () {
            $entityClass = $this->wRequest()->query('entity');
            /* @var $instance EntityAbstract */
            $instance = new $entityClass;
            return $instance->meta()['methods'];
        });
    }
}