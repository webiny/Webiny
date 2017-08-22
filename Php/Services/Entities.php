<?php

namespace Apps\Webiny\Php\Services;

use Apps\Webiny\Php\DevTools\Api\ApiContainer;
use Apps\Webiny\Php\DevTools\Services\AbstractService;
use Apps\Webiny\Php\PackageManager\Parser\EntityParser;
use Apps\Webiny\Php\PackageManager\App;
use Webiny\Component\StdLib\StdObject\StdObjectWrapper;

/**
 * Class Entities
 * @package Apps\Webiny\Php\Services
 */
class Entities extends AbstractService
{
    protected function serviceApi(ApiContainer $api)
    {
        /**
         * @api.name List all entities registered in the system
         * @api.description This method returns a list of all system entities
         * @api.query.withDetails boolean Return full details (default: false)
         */
        $api->get('/', function () {

            // Entities listed here will not be returned in the final response.
            $excludeEntities = $this->wRequest()->query('exclude', []);

            $singleEntity = false;
            $multipleEntities = $this->wRequest()->query('entities', false);

            if (!$multipleEntities) {
                $singleEntity = $this->wRequest()->query('entity', false);
                if ($singleEntity) {
                    $multipleEntities = [$singleEntity];
                }
            }

            $details = $this->wRequest()->query('details', '');
            $details = explode(',', $details);

            $includeCrudMethods = StdObjectWrapper::toBool($this->wRequest()->query('crudMethods', false));
            $entities = [];

            /* @var $app App */
            foreach ($this->wApps() as $app) {
                foreach ($app->getEntities() as $entity) {
                    if (in_array($entity['class'], $excludeEntities)) {
                        continue;
                    }

                    if ($multipleEntities && !in_array($entity['class'], $multipleEntities)) {
                        continue;
                    }

                    $entityParser = new EntityParser($entity['class']);
                    if (in_array('attributes', $details)) {
                        $entity['attributes'] = $entityParser->getAttributes();
                    }

                    if (in_array('methods', $details)) {
                        $entity['methods'] = $entityParser->getApiMethods($includeCrudMethods);
                    }

                    if (in_array('relations', $details)) {
                        $entity['relations'] = $entityParser->getRelations();
                    }

                    if ($singleEntity && $entity['class'] == $singleEntity) {
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
        $api->get('attributes', function () {
            $entityClass = $this->wRequest()->query('entity');
            $entity = new EntityParser($entityClass);

            return $entity->getAttributes();
        });

        /**
         * @api.name Get entity methods
         * @api.description This method returns a list of methods for given entity class name
         * @api.query.entity string Entity class for which to get methods
         */
        $api->get('methods', function () {
            $entityClass = $this->wRequest()->query('entity');
            $entity = new EntityParser($entityClass);

            return $entity->getApiMethods(false);
        });
    }
}