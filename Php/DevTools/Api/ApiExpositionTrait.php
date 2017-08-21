<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\DevTools\Api;

use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;
use Apps\Webiny\Php\DevTools\Response\EntityResponse;
use Apps\Webiny\Php\DevTools\Response\ListResponse;
use Apps\Webiny\Php\RequestHandlers\ApiException;
use Webiny\Component\Entity\EntityCollection;

/**
 * Trait ApiExpositionTrait
 *
 * This class is used when we want to expose entity or service methods to the API
 *
 * @package Apps\Webiny\Php\Dispatchers
 */
trait ApiExpositionTrait
{
    protected static $entityApis = [];
    protected $processingEvent = null;

    /**
     * @var array
     */
    protected $apiMethods;

    /**
     * Format given EntityCollection using $fields into a standard list response
     *
     * @param EntityCollection $collection
     * @param string           $fields
     *
     * @return ListResponse
     */
    public static function apiFormatList(EntityCollection $collection, $fields)
    {
        $perPage = $collection->getLimit();
        $offset = $collection->getOffset();
        $page = 1;
        if ($offset > 0) {
            $page = ($offset / $perPage) + 1;
        }

        return new ListResponse([
            'meta' => [
                'totalCount'  => $collection->totalCount(),
                'totalPages'  => $perPage > 0 ? ceil($collection->totalCount() / $perPage) : 1,
                'perPage'     => $perPage,
                'currentPage' => $page,
                'fields'      => $fields
            ],
            'list' => $collection->toArray($fields)
        ]);
    }

    /**
     * Format given Entity using $fields into a standard entity response
     *
     * @param AbstractEntity $entity
     * @param string         $fields
     *
     * @return EntityResponse
     */
    public static function apiFormatEntity(AbstractEntity $entity, $fields)
    {
        return new EntityResponse([
            'meta'   => [
                'fields' => $fields
            ],
            'entity' => $entity->toArray($fields)
        ]);
    }

    /**
     * Expose entity API
     *
     * @param callable $callable
     *
     * @return ApiContainer
     * @throws ApiException
     */
    public function api($callable)
    {
        $class = get_called_class();
        if (!isset(static::$entityApis[$class])) {
            static::$entityApis[$class] = new ApiContainer($this, $callable);
            static::$entityApis[$class]->addInitializer($callable);
        } else {
            $apiContainer = static::$entityApis[$class];
            if(spl_object_hash($this) == spl_object_hash($apiContainer->instance)) {
                $apiContainer->addInitializer($callable);
            }
        }
    }

    /**
     * @return ApiContainer
     */
    public function getApiContainer()
    {
        $class = get_called_class();
        /* @var $apiContainer ApiContainer */
        $apiContainer = static::$entityApis[$class];
        if (!$apiContainer->isInitialized()) {
            $apiContainer->initialize();
        }

        return $apiContainer;
    }
}