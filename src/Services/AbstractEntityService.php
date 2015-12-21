<?php
namespace Webiny\Core\Services;

use Webiny\Component\Entity\EntityException;
use Webiny\Component\Rest\Interfaces\CrudInterface;
use Webiny\Component\Rest\RestErrorException;
use Webiny\Core\Entity\EntityAbstract;

abstract class AbstractEntityService extends AbstractService implements CrudInterface
{
    const VALIDATION_ERROR = 'Entity attribute validation failed';
    const INVALID_POPULATE_DATA = 'Invalid data provided for entity populate()';

    private $entityClass;

    /**
     * Get entity instance
     * @rest.ignore
     * @return EntityAbstract
     */
    abstract public function getEntity();

    public function __construct()
    {
        $this->entityClass = get_class($this->getEntity());
    }

    /**
     * Restore entity with given ID
     *
     * @rest.method POST
     */
    public function restore($id)
    {
        $restoredEntity = $this->getEntity()->restore($id);

        return $restoredEntity->toArray($this->restGetFields(), $this->restGetFieldsDepth());
    }

    /**
     * Retrieve all records in a collection.
     *
     * @rest.default
     * @rest.method get
     *
     * @param bool $toArray By default, toArray will be execute on the result set - you can optionally get the entities instead
     * @return array|mixed A list of retrieved records.
     * As an array with properties [meta: [totalCount, perPage, page], data: []].
     */
    public function crudList($toArray = true)
    {
        $filters = $this->getFilters();
        $sorter = $this->restGetSortFields();

        $entities = $this->getEntity()->find($filters, $sorter, $this->restGetPerPage(), $this->restGetPage());
        $response = [
            'meta' => [
                'totalCount'  => $entities->totalCount(),
                'totalPages'  => ceil($entities->totalCount() / $this->restGetPerPage()),
                'perPage'     => $this->restGetPerPage(),
                'currentPage' => $this->restGetPage(),
                'filters'     => $filters,
                'sorter'      => $sorter
            ],
            'data' => $toArray ? $entities->toArray($this->restGetFields(), $this->restGetFieldsDepth()) : $entities
        ];

        return $response;
    }

    /**
     * Create new record.
     *
     * @rest.default
     * @rest.method post
     * @param bool $data
     * @param bool $toArray
     * @return array|mixed Array containing the newly created record.
     * @throws RestErrorException
     */
    public function crudCreate($data = false, $toArray = true)
    {
        $entity = $this->getEntity();
        try {
            if (!$data) {
                $data = $this->getRequestData();
            }

            if (!$this->isArray($data) && !$this->isArrayObject($data)) {
                throw new RestErrorException('Invalid data provided', self::INVALID_POPULATE_DATA, '', 400);
            }
            $entity->populate($data);
            $entity->save();
        } catch (EntityException $e) {
            if ($e->getCode() == EntityException::VALIDATION_FAILED) {
                $restException = new RestErrorException($e->getMessage(), self::VALIDATION_ERROR, '', 422);
                foreach ($e->getInvalidAttributes() as $attrName => $attrError) {
                    $restException->addError([$attrName => $attrError]);
                }
                throw $restException;
            }
        }

        if (!$toArray) {
            return $entity;
        }
        return $entity->toArray($this->restGetFields(), $this->restGetFieldsDepth());
    }

    /**
     * Delete a record with the given id.
     *
     * @rest.default
     * @rest.method delete
     *
     * @param string $id Id of the record to be deleted.
     *
     * @return bool True if delete was successful or false.
     * @throws RestErrorException
     */
    public function crudDelete($id)
    {
        $entity = $this->getEntity()->findById($id);
        if ($entity) {
            try {
                $entity->delete();
            } catch (EntityException $e) {
                throw new RestErrorException('Failed to delete entity!', $e->getMessage(), $e->getCode(), 400);
            }

            return true;
        }

        throw new RestErrorException('Not found', $this->entityClass . ' with id `' . $id . '` was not found!');
    }

    /**
     * Retrieve a single record.
     *
     * @rest.default
     * @rest.method get
     *
     * @param string $id Id of the record that should be retrieved.
     *
     * @return array|mixed The requested record
     * @throws RestErrorException
     */
    public function crudGet($id)
    {
        try {
            $entity = $this->getEntity()->findById($id);
            if ($entity) {
                return $entity->toArray($this->restGetFields(), $this->restGetFieldsDepth());
            }
        } catch (\MongoException $e) {
            throw new RestErrorException('Database error', $e->getMessage(), $e->getCode(), 400);
        }
        throw new RestErrorException('Not found', $this->entityClass . ' with id `' . $id . '` was not found!');
    }

    /**
     * Replace a single record.
     *
     * Note that the difference between crudUpdate and crudReplace is that in crudReplace, all current record attributes
     * should be removed and the new attributes should be added, while in crudUpdate the attributes would only be added
     * or deleted. In crudUpdate, if the record doesn't exist, it can be created.
     *
     * @see http://tools.ietf.org/html/rfc5789
     *
     * @rest.default
     * @rest.method put
     *
     * @param string $id Id of the record that should be replaced.
     *
     * @return array|mixed The replaced record.
     */
    public function crudReplace($id)
    {
        // Not used in entity services
    }

    /**
     * Update a single record.
     *
     * Note that the difference between crudUpdate and crudReplace is that in crudReplace, all current record attributes
     * should be removed and the new attributes should be added, while in crudUpdate the attributes would only be added
     * or deleted. In crudUpdate, if the record doesn't exist, it can be created.
     *
     * @see http://tools.ietf.org/html/rfc5789
     *
     * @rest.default
     * @rest.method patch
     *
     * @param string $id Id of the record that should be replaced.
     *
     * @return array|mixed The updated, or created, record.
     * @throws RestErrorException
     */
    public function crudUpdate($id)
    {
        $data = $this->getRequestData();
        if (!$this->isArray($data) && !$this->isArrayObject($data)) {
            throw new RestErrorException('Invalid data provided', self::INVALID_POPULATE_DATA, '', 400);
        }

        $entity = $this->getEntity()->findById($id);
        if ($entity) {
            try {
                $entity->populate($data);
                $entity->save();

                return $entity->toArray($this->restGetFields(), $this->restGetFieldsDepth());
            } catch (EntityException $e) {
                $restException = new RestErrorException($e->getMessage(), self::VALIDATION_ERROR, '', 422);
                foreach ($e->getInvalidAttributes() as $attrName => $attrError) {
                    $restException->addError([$attrName => $attrError]);
                }
                throw $restException;
            }
        }

        throw new RestErrorException('Not found', 'Task with id `' . $id . '` was not found!');
    }
}