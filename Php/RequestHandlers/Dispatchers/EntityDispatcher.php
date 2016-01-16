<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\RequestHandlers\Dispatchers;

use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Apps\Core\Php\DevTools\Response\ApiErrorResponse;
use Apps\Core\Php\DevTools\Response\ApiResponse;
use Apps\Core\Php\Lib\Inflect;
use Apps\Core\Php\RequestHandlers\ApiEvent;
use Apps\Core\Php\RequestHandlers\ApiException;
use Webiny\Component\Entity\EntityException;

/**
 * TODO:    Refactor each flow into service tagged with 'entity-dispatcher-flow' implementing an interface.
 *          This will allow us to create plugins for dispatcher.
 *
 * Class EntityDispatcher
 * @package Apps\Core\Php\RequestHandlers\Dispatchers
 */
class EntityDispatcher extends AbstractApiDispatcher
{
    const VALIDATION_ERROR = 'Entity attribute validation failed';
    const INVALID_POPULATE_DATA = 'Invalid data provided for entity populate()';

    private $entityClass;
    private $params;
    private $flows = [
        'GET'    => [
            0 => 'crudList',
            1 => 'crudGet'
        ],
        'POST'   => [
            0 => 'crudCreate'
        ],
        'PATCH'  => [
            1 => 'crudUpdate'
        ],
        'DELETE' => [
            1 => 'crudDelete'
        ]
    ];

    public function handle(ApiEvent $event)
    {
        if (!$event->getUrl()->startsWith('/entities')) {
            return false;
        }

        $result = null;
        $request = $this->parseUrl($event->getUrl()->replace('/entities', ''));

        $httpMethod = $this->wRequest()->getRequestMethod();
        $this->params = $request['params'];

        $inflector = new Inflect();
        $this->entityClass = '\\Apps\\' . $request['app'] . '\\Php\\Entities\\' . $inflector->singularize($request['class']);
        if (!class_exists($this->entityClass)) {
            return new ApiErrorResponse([], 'Entity class ' . $this->entityClass . ' does not exist!');
        }

        $paramsCount = count($this->params);

        try {
            $flow = $this->arr($this->flows)->keyNested($httpMethod . '.' . $paramsCount);

            if (!$flow && $httpMethod == 'POST' && $paramsCount >= 2) {
                $flow = 'executeMethod';
            }

            if ($flow) {
                $result = $this->$flow();
            }
        } catch (ApiException $e) {
            return new ApiErrorResponse($e->getErrors(), $e->getMessage(), $e->getErrorDescription(), $e->getErrorCode(),
                $e->getResponseCode());
        }

        if ($result) {
            return new ApiResponse($result);
        }

        return null;
    }

    /**
     * @return EntityAbstract
     */
    protected function getEntity()
    {
        return new $this->entityClass();
    }

    protected function crudList()
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
            'data' => $entities->toArray($this->restGetFields(), $this->restGetFieldsDepth())
        ];

        return $response;
    }

    protected function crudGet()
    {
        $id = $this->params[0];
        try {
            $entity = $this->getEntity()->findById($id);
            if ($entity) {
                return $entity->toArray($this->restGetFields(), $this->restGetFieldsDepth());
            }
        } catch (\MongoException $e) {
            throw new \Exception('Database error', $e->getMessage(), $e->getCode(), 400);
        }
        throw new \Exception('Not found', $this->entityClass . ' with id `' . $id . '` was not found!');
    }

    protected function crudCreate()
    {
        $entity = $this->getEntity();
        try {
            $data = $this->getRequestData();

            if (!$this->isArray($data) && !$this->isArrayObject($data)) {
                throw new ApiException('Invalid data provided', self::INVALID_POPULATE_DATA, '', 400);
            }
            $entity->populate($data);
            $entity->save();
        } catch (EntityException $e) {
            if ($e->getCode() == EntityException::VALIDATION_FAILED) {
                $restException = new ApiException($e->getMessage(), self::VALIDATION_ERROR, '', 422);
                foreach ($e->getInvalidAttributes() as $attrName => $attrError) {
                    $restException->addError([$attrName => $attrError]);
                }
                throw $restException;
            }
        }

        return $entity->toArray($this->restGetFields(), $this->restGetFieldsDepth());
    }

    protected function crudUpdate()
    {
        $id = $this->params[0];
        $data = $this->getRequestData();
        if (!$this->isArray($data) && !$this->isArrayObject($data)) {
            throw new ApiException('Invalid data provided', self::INVALID_POPULATE_DATA, '', 400);
        }

        $entity = $this->getEntity()->findById($id);
        if ($entity) {
            try {
                $entity->populate($data);
                $entity->save();

                return $entity->toArray($this->restGetFields(), $this->restGetFieldsDepth());
            } catch (EntityException $e) {
                $apiException = new ApiException($e->getMessage(), self::VALIDATION_ERROR, '', 422);
                foreach ($e->getInvalidAttributes() as $attrName => $attrError) {
                    $apiException->addError([$attrName => $attrError]);
                }
                throw $apiException;
            }
        }

        throw new ApiException('Not found', $this->entityClass . ' with id `' . $id . '` was not found!');
    }

    protected function crudDelete()
    {
        $id = $this->params[0];
        $entity = $this->getEntity()->findById($id);
        if ($entity) {
            try {
                $entity->delete();
            } catch (EntityException $e) {
                throw new ApiException('Failed to delete entity!', $e->getMessage(), $e->getCode(), 400);
            }

            return true;
        }

        throw new ApiException('Not found', $this->entityClass . ' with id `' . $id . '` was not found!');
    }

    protected function executeMethod()
    {
        $id = $this->params[0];
        $method = $this->toCamelCase($this->params[1]);

        $entity = $this->getEntity()->findById($id);
        if ($entity) {
            try {
                $params = array_slice($this->params, 2);

                return call_user_func_array([$entity, $method], $params);
            } catch (EntityException $e) {
                throw new ApiException('Error while executing method', $e->getMessage(), $e->getCode(), 400);
            }
        }

        throw new ApiException('Not found', $this->entityClass . ' with id `' . $id . '` was not found!');
    }
}