<?php

namespace Apps\Todo\Backend\Todo\Php\Services;

use Apps\Todo\Common\Php\Entities\TodoTask;
use Webiny\Component\Entity\EntityException;
use Webiny\Component\Http\HttpTrait;
use Webiny\Component\Http\Request;
use Webiny\Component\Mongo\MongoException;
use Webiny\Component\Rest\Interfaces\CrudInterface;
use Webiny\Component\Rest\RestErrorException;
use Webiny\Component\Rest\RestTrait;
use Webiny\Platform\Responses\JsonErrorResponse;
use Webiny\Platform\Responses\JsonResponse;

class Item implements CrudInterface
{
    use HttpTrait, RestTrait;

    /**
     * Restore a record by given ID
     *
     * @rest.method post
     *
     * @return array|mixed Array containing the restored record.
     */
    public function restore($id){
        $task = TodoTask::restore($id);
        return $task->toArray();
    }

    /**
     * Retrieve all records in a collection.
     *
     * @rest.default
     * @rest.method get
     *
     * @return array|mixed A list of retrieved records.
     * As an array with properties [records, totalCount, perPage, page].
     */
    public function crudList()
    {
        $tasks = TodoTask::find([], [], $this->restGetPerPage(), $this->restGetPage());

        return $tasks->toArray();
    }

    /**
     * Create new record.
     *
     * @rest.default
     * @rest.method post
     *
     * @return array|mixed Array containing the newly created record.
     */
    public function crudCreate()
    {
        $task = new TodoTask();
        $task->task = $this->httpRequest()->payload('task');
        $task->save();

        return $task->toArray();
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
     *
     * @throws EntityException
     * @throws RestErrorException
     */
    public function crudDelete($id)
    {
        $task = TodoTask::findById($id);
        if ($task) {
            $task->delete();

            return true;
        }

        throw new RestErrorException('Not found', 'Task with id `' . $id . '` was not found!', 404);
    }

    /**
     * Retrieve a single record.
     *
     * @rest.default
     * @rest.method get
     *
     * @param string $id Id of the record that should be retrieved.
     *
     * @return array|mixed The requested record.
     * @throws RestErrorException
     */
    public function crudGet($id)
    {
        try {
            $task = TodoTask::findById($id);
            if ($task) {
                return $task->toArray();
            }
        } catch (\MongoException $e) {

        }
        throw new RestErrorException('Not found', 'Task with id `' . $id . '` was not found!', 404);
    }

    /**
     * Replace a single record.
     *
     * Note that the difference between crudUpdate and crudReplace is that in crudReplace, all current record attributes
     * should be removed and the new attributes should be added, while in crudUpdate the records would only be added
     * or deleted. In crudUpdate, if the record doesn't exist, it can be created.
     *
     * @link http://tools.ietf.org/html/rfc5789
     *
     * @rest .default
     * @rest .method put
     *
     * @param string $id Id of the record that should be replaced.
     *
     * @return array|mixed The replaced record.
     */
    public function crudReplace($id)
    {
        // TODO: Implement crudReplace() method.
    }

    /**
     * Update a single record.
     *
     * Note that the difference between crudUpdate and crudReplace is that in crudReplace, all current record attributes
     * should be removed and the new attributes should be added, while in crudUpdate the records would only be added
     * or deleted. In crudUpdate, if the record doesn't exist, it can be created.
     *
     * @link http://tools.ietf.org/html/rfc5789
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
        $data = $this->httpRequest()->payload();
        $task = TodoTask::findById($id);
        if ($task) {
            try {
                $task->populate($data);
                $task->save();

                return $task->toArray();
            } catch (EntityException $e) {
                $error = new RestErrorException('Entity error', 'Entity attribute validation failed', 422);
                $error->addError($e->getInvalidAttributes());
                throw $error;
            }
        }

        throw new RestErrorException('Not found', 'Task with id `' . $id . '` was not found!', 404);
    }
}