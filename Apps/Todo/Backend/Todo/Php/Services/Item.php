<?php

namespace Apps\Todo\Backend\Todo\Php\Services;

use Apps\Todo\Common\Php\Entities\TodoTask;
use Webiny\Component\Entity\EntityException;
use Webiny\Component\Http\HttpTrait;
use Webiny\Component\Rest\Interfaces\CrudInterface;
use Webiny\Platform\Responses\JsonErrorResponse;
use Webiny\Platform\Responses\JsonResponse;

class Item implements CrudInterface
{
    use HttpTrait;

    /**
     * @rest.method get
     *
     * @param $id
     *
     * @return bool
     */
    public function toggleStatus($id)
    {
        $task = TodoTask::findById($id);
        if ($task) {
            if ($task->completed) {
                $task->completed = false;
            } else {
                $task->completed = true;
            }
            $task->save();

            return new JsonResponse(['completed' => $task->completed]);
        }

        return new JsonErrorResponse([], 'Task with id `'.$id.'` was not found!');
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
        $tasks = TodoTask::find();
        return new JsonResponse($tasks->toArray());
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

        return new JsonResponse($task->toArray(''));
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
     */
    public function crudDelete($id)
    {
        $task = TodoTask::findById($id);
        if ($task) {
            $task->delete();

            return new JsonResponse([]);
        }

        return new JsonErrorResponse([], 'Task with id `'.$id.'` was not found!');
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
     */
    public function crudGet($id)
    {
        $task = TodoTask::findById($id);
        return new JsonResponse($task->toArray());
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
     * @rest.default
     * @rest.method put
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
     */
    public function crudUpdate($id)
    {
        $data = $this->httpRequest()->payload();
        $task = TodoTask::findById($id);
        if ($task) {
            try{
                $task->populate($data);
                $task->save();
            } catch(EntityException $e){
                $attrs = $e->getInvalidAttributes();
                die(print_r($attrs));
            }


            return new JsonResponse([]);
        }

        return new JsonErrorResponse([], 'Task with id `'.$id.'` was not found!');
    }
}