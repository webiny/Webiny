<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\Api;

use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Response\EntityResponse;
use Apps\Webiny\Php\Lib\Response\ListResponse;
use Webiny\Component\Entity\EntityCollection;

/**
 * Trait ApiExpositionTrait
 *
 * This class is used when we want to expose entity or service methods as an API
 */
trait ApiExpositionTrait
{
    protected static $isDiscoverable = true;
    protected static $classId;
    protected static $apiContainers = [];

    /**
     * @var array
     */
    protected $apiMethods;

    /**
     * Initialize the given ApiContainer
     *
     * @param ApiContainer $api
     *
     * @return mixed
     */
    abstract protected function initializeApi(ApiContainer $api);

    /**
     * Get class id which uniquely identifies the class that uses ApiExpositionTrait
     *
     * @return string
     */
    public static function getClassId()
    {
        return static::$classId;
    }

    public static function isDiscoverable()
    {
        return static::$isDiscoverable;
    }

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
     * Get ApiContainer for current object (AbstractEntity or AbstractService)
     * @return ApiContainer
     */
    public function getApi()
    {
        $class = get_called_class();
        /* @var $apiContainer ApiContainer */
        $apiContainer = static::$apiContainers[$class] ?? null;
        if (!$apiContainer) {
            $apiContainer = new ApiContainer($this);
            static::$apiContainers[$class] = $apiContainer;
            $this->initializeApi($apiContainer);
        }

        return $apiContainer;
    }
}