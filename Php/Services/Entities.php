<?php

namespace Apps\Core\Php\Services;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Services\AbstractService;
use Apps\Core\Php\PackageManager\Parser\EntityParser;
use Apps\Core\Php\PackageManager\App;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\StdObjectWrapper;

/**
 * Class Entities
 * @package Apps\Core\Php\Services
 */
class Entities extends AbstractService
{
    use WebinyTrait, StdLibTrait;

    function __construct()
    {
        parent::__construct();
        /**
         * @api.name List all entities registered in the system
         * @api.description This method returns a list of all system entities
         * @api.query.withDetails boolean Return full details (default: false)
         */
        $this->api('get', '/', function () {
            $singleEntity = $this->wRequest()->query('entity', false);
            $withDetails = StdObjectWrapper::toBool($this->wRequest()->query('withDetails', false));
            $includeCrudMethods = StdObjectWrapper::toBool($this->wRequest()->query('crudMethods', false));
            $entities = [];
            /* @var $app App */
            foreach ($this->wApps() as $app) {
                foreach ($app->getEntities() as $entity) {
                    if ($singleEntity && $entity['class'] != $singleEntity) {
                        continue;
                    }

                    if ($withDetails) {
                        $entityParser = new EntityParser($entity['class']);
                        $entity['attributes'] = $entityParser->getAttributes();
                        $entity['methods'] = $entityParser->getApiMethods($includeCrudMethods);
                        $entity['relations'] = $entityParser->getRelations();
                    }

                    if ($entity['class'] == $singleEntity) {
                        return $entity;
                    }
                    
                    $entities[] = $entity;
                }
            }

            return $entities;
        });

        /**
         * @api.name Get entity attributes
         * @api.description This method returns a list of attributes for given entity class name
         * @api.query.entity string Entity class for which to get attributes
         */
        $this->api('get', 'attributes', function () {
            $entityClass = $this->wRequest()->query('entity');
            $entity = new EntityParser($entityClass);

            return $entity->getAttributes();
        });

        /**
         * @api.name Get entity methods
         * @api.description This method returns a list of methods for given entity class name
         * @api.query.entity string Entity class for which to get methods
         */
        $this->api('get', 'methods', function () {
            $entityClass = $this->wRequest()->query('entity');
            $entity = new EntityParser($entityClass);

            return $entity->getApiMethods(false);
        });
    }
}