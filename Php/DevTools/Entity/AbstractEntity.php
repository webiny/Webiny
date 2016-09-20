<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools\Entity;

use Apps\Core\Php\DevTools\Exceptions\AppException;
use Apps\Core\Php\Dispatchers\ApiExpositionTrait;
use Apps\Core\Php\Entities\User;
use Apps\Core\Php\RequestHandlers\ApiException;
use Webiny\Component\Entity\Attribute\AttributeType;
use Webiny\Component\Entity\Attribute\DateAttribute;
use Apps\Core\Php\DevTools\WebinyTrait;
use Webiny\Component\Entity\Attribute\Many2ManyAttribute;
use Webiny\Component\Entity\Attribute\One2ManyAttribute;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\Entity\EntityException;
use Webiny\Component\Mongo\Index\AbstractIndex;
use Webiny\Component\Mongo\Index\SingleIndex;
use Webiny\Component\StdLib\StdObject\DateTimeObject\DateTimeObject;

/**
 * AbstractEntity class is the main class to extend when creating your own entities
 *
 * Class AbstractEntity
 *
 * @property string         $id
 * @property DateTimeObject $createdOn
 * @property User           $createdBy
 * @property DateTimeObject $modifiedOn
 * @property User           $modifiedBy
 * @property DateTimeObject $deletedOn
 * @property User           $deletedBy
 * @method void on (string $eventName, \Closure $callback)
 * @package Apps\Core\Php\DevTools\Entity
 */
abstract class AbstractEntity extends \Webiny\Component\Entity\AbstractEntity
{
    use WebinyTrait, ApiExpositionTrait;

    protected $indexes = [];
    protected $instanceCallbacks = [];
    protected static $classCallbacks = [];

    public static function onExtend($callback)
    {
        static::on('onExtend', $callback);
    }

    public static function onBeforeCreate($callback)
    {
        static::on('onBeforeCreate', $callback);
    }

    public static function onAfterCreate($callback)
    {
        static::on('onAfterCreate', $callback);
    }

    public static function onBeforeUpdate($callback)
    {
        static::on('onBeforeUpdate', $callback);
    }

    public static function onAfterUpdate($callback)
    {
        static::on('onAfterUpdate', $callback);
    }

    public static function onBeforeSave($callback)
    {
        static::on('onBeforeSave', $callback);
    }

    public static function onAfterSave($callback)
    {
        static::on('onAfterSave', $callback);
    }

    public static function onBeforeDelete($callback)
    {
        static::on('onBeforeDelete', $callback);
    }

    public static function onAfterDelete($callback)
    {
        static::on('onAfterDelete', $callback);
    }

    /**
     * Find entity by ID - deleted entities won't be included in search by default
     *
     * @param string $id
     *
     * @param bool   $includeDeleted
     *
     * @return AbstractEntity|null
     * @throws \Webiny\Component\Entity\EntityException
     */
    public static function findById($id, $includeDeleted = false)
    {
        if (!$id || strlen($id) != 24) {
            return null;
        }
        $instance = static::entity()->get(get_called_class(), $id);
        if ($instance) {
            return $instance;
        }
        $mongo = static::entity()->getDatabase();

        $criteria = self::setEntityFilters(['_id' => $mongo->id($id)]);

        if (!$includeDeleted) {
            $criteria['deletedOn'] = null;
        }

        $data = $mongo->findOne(static::$entityCollection, $criteria);
        if (!$data) {
            return null;
        }
        $instance = new static;
        $data['__webiny_db__'] = true;
        $instance->populate($data);

        return static::entity()->add($instance);
    }

    /**
     * Find one recotd by given conditions
     *
     * @param array $conditions
     * @param bool  $includeDeleted
     *
     * @return AbstractEntity|null
     */
    public static function findOne(array $conditions = [], $includeDeleted = false)
    {
        $conditions = self::setEntityFilters(self::prepareFilters($conditions));

        if (!$includeDeleted) {
            $conditions['deletedOn'] = null;
        }

        return parent::findOne($conditions);
    }

    /**
     * Find entities
     *
     * @param mixed $conditions
     *
     * @param array $order Example: ['-name', '+title']
     * @param int   $limit
     * @param int   $page
     *
     * @param bool  $includeDeleted
     *
     * @return EntityCollection
     */
    public static function find(array $conditions = [], array $order = [], $limit = 0, $page = 0, $includeDeleted = false)
    {
        $conditions = static::setEntityFilters(static::prepareFilters($conditions));
        if (!$includeDeleted) {
            $conditions['deletedOn'] = null;
        }

        return parent::find($conditions, $order, $limit, $page);
    }

    /**
     * Count records using given criteria
     *
     * @param array $conditions
     *
     * @param bool  $includeDeleted
     *
     * @return int
     */
    public static function count(array $conditions = [], $includeDeleted = false)
    {
        if (!$includeDeleted) {
            $conditions['deletedOn'] = null;
        }

        return parent::count($conditions);
    }

    /**
     * Add index
     *
     * @param AbstractIndex|array $index
     *
     * @return $this
     * @throws EntityException
     */
    public function index($index)
    {
        if ($index instanceof AbstractIndex) {
            $index = [$index];
        }

        if (!is_array($index)) {
            throw new EntityException(EntityException::MSG_INVALID_ARG, ['$index', 'array or AbstractIndex']);
        }

        /* @var AbstractIndex $i */
        foreach ($index as $i) {
            $this->indexes[$i->getName()] = $i;
        }

        return $this;
    }

    /**
     * Get all indexes
     * @return array
     */
    public function getIndexes()
    {
        return $this->indexes;
    }

    public function __construct()
    {
        parent::__construct();
        $this->apiMethods = $this->arr();

        /**
         * Add the following built-in system attributes:
         * createdOn, modifiedOn, deletedOn, deleted and user
         */
        $userClass = $this->wAuth()->getUserClass();
        $this->attr('createdOn')->datetime()->setDefaultValue('now')->setToArrayDefault();
        $this->attr('createdBy')->many2one()->setEntity($userClass)->setDefaultValue(function () {
            return $this->wAuth()->getUser();
        });
        $this->attr('modifiedOn')->datetime()->onToDb(function ($value) {
            if ($this->exists() && !$this->deletedOn) {
                return $this->datetime()->getMongoDate();
            }

            return $value;
        });
        $this->attr('modifiedBy')->many2one()->setEntity($userClass)->onToDb(function ($value) {
            if ($this->exists() && !$this->deletedOn) {
                return $this->wAuth()->getUser()->id;
            }

            return $value;
        });
        $this->attr('deletedOn')->datetime();
        $this->attr('deletedBy')->many2one()->setEntity($userClass);

        $this->index([
            new SingleIndex('id', 'id', false, true),
            new SingleIndex('createdOn', 'createdOn'),
            new SingleIndex('createdBy', 'createdBy'),
            new SingleIndex('deletedOn', 'deletedOn')
        ]);

        /**
         * @api.name List records
         */
        $this->api('GET', '/', function () {
            $filters = $this->wRequest()->getFilters();
            $sorter = $this->wRequest()->getSortFields();

            $entities = $this->find($filters, $sorter, $this->wRequest()->getPerPage(), $this->wRequest()->getPage());

            return $this->apiFormatList($entities, $this->wRequest()->getFields());
        });

        /**
         * @api.name Get a record by ID
         */
        $this->api('GET', '{id}', function () {
            return $this->toArray($this->wRequest()->getFields());
        });

        /**
         * @api.name Create a new record
         */
        $this->api('POST', '/', function () {
            try {
                $data = $this->wRequest()->getRequestData();

                if (!$this->isArray($data) && !$this->isArrayObject($data)) {
                    throw new ApiException('Invalid data provided', 'WBY-ED-CRUD_CREATE_FLOW-1', 400);
                }
                $this->populate($data)->save();
            } catch (EntityException $e) {
                if ($e->getCode() == EntityException::VALIDATION_FAILED) {
                    throw new ApiException($e->getMessage(), 'WBY-ED-CRUD_CREATE_FLOW-2', 422, $e->getInvalidAttributes());
                }

                $code = $e->getCode();
                if (!$code) {
                    $code = 'WBY-ED-CRUD_CREATE_FLOW-2';
                }
                throw new ApiException($e->getMessage(), $code, 422);
            }

            return $this->toArray($this->wRequest()->getFields());
        });

        /**
         * @api.name Update a record by ID
         */
        $this->api('PATCH', '{id}', function () {
            try {
                $this->populate($this->wRequest()->getRequestData())->save();

                return $this->toArray($this->wRequest()->getFields());
            } catch (EntityException $e) {
                if ($e->getCode() == EntityException::VALIDATION_FAILED) {
                    throw new ApiException($e->getMessage(), 'WBY-ED-CRUD_UPDATE-1', 422, $e->getInvalidAttributes());
                }

                $code = $e->getCode();
                if (!$code) {
                    $code = 'WBY-ED-CRUD_UPDATE_FLOW-1';
                }
                throw new ApiException($e->getMessage(), $code, 422);
            }
        });

        /**
         * @api.name Delete a record by ID
         */
        $this->api('DELETE', '{id}', function () {
            try {
                $this->delete();

                return true;
            } catch (EntityException $e) {
                throw new ApiException('Failed to delete entity! ' . $e->getMessage(), $e->getCode(), 400);
            }
        });

        /**
         * @api.name Delete multiple records by given ids
         * @api.description This method will delete multiple records given by an array of entity IDs
         */
        $this->api('POST', 'delete', function () {
            $ids = $this->wRequest()->getRequestData()['ids'];
            try {
                static::find(['id' => $ids])->delete();

                return true;
            } catch (EntityException $e) {
                throw new ApiException('Failed to delete entity! ' . $e->getMessage(), $e->getCode(), 400);
            }
        })->setBodyValidators(['ids' => 'required']);

        /**
         * Fire event for registering extra attributes
         */
        $this->trigger('onExtend');
    }

    /**
     * This will be called before trying to delete an entity. Here you can define your own business rules to allow/prevent deletion.
     * If you want to prevent deletion - throw an AppException
     * @throws AppException
     */
    public function canDelete()
    {
    }

    public function delete($permanent = false)
    {
        /**
         * Make sure the entity instance has an ID
         */
        if ($this->id == null) {
            return false;
        }

        $this->canDelete();

        $this->trigger('onBeforeDelete');
        $this->processDelete($permanent);
        $this->trigger('onAfterDelete');
        if (!$permanent) {
            $this->deletedOn = $this->datetime()->getMongoDate();
            $this->deletedBy = $this->wAuth()->getUser();
            $this->save();
        }


        return true;
    }

    /**
     * @return bool
     */
    public function save()
    {
        $isNew = !$this->exists();

        if ($isNew) {
            $this->trigger('onBeforeCreate');
        } else {
            $this->trigger('onBeforeUpdate');
        }

        $this->trigger('onBeforeSave');
        $save = parent::save();
        $this->trigger('onAfterSave');

        if ($isNew) {
            $this->trigger('onAfterCreate');
        } else {
            $this->trigger('onAfterUpdate');
        }

        return $save;
    }

    public function trigger($eventName, ...$params)
    {
        $this->processCallbacks($eventName, ...$params);
    }

    /**
     * Get array of entity filters
     *
     * @return array
     */
    protected static function entityFilters()
    {
        return [];
    }

    /**
     * Sets custom filters that can be sent to find and findOne methods
     *
     * @param array $conditions
     *
     * @return array
     * @throws AppException
     */
    protected static function setEntityFilters($conditions)
    {
        $customFilters = static::entityFilters();
        $staticFilter = null;
        /* @var Filter $filter */
        foreach ($customFilters as $filter) {
            if (!($filter instanceof Filter)) {
                continue;
            }
            $key = $filter->getName();
            if ($key === '*') {
                $staticFilter = $filter;
                continue;
            }
            if (isset($conditions[$key])) {
                $filterValue = $conditions[$key];
                unset($conditions[$key]);
                $conditions = array_merge($conditions, $filter($filterValue));
            }
        }

        // If we have a static filter, let's apply those too
        if ($staticFilter) {
            $staticFilterConditions = $staticFilter();
            if (is_array($staticFilterConditions)) {
                $conditions = array_merge($conditions, $staticFilter());
            }
        }

        return $conditions;
    }

    protected static function prepareFilters($filters)
    {
        $builtFilters = [];
        $entity = new static;
        $attributes = $entity->getAttributes()->val();
        foreach ($filters as $fName => $fValue) {
            // Construct an $in statement only if filter value is index-based
            if (!self::str($fName)->startsWith('$') && is_array($fValue) && !count(array_filter(array_keys($fValue), 'is_string')) > 0) {
                $fValue = [
                    '$in' => $fValue
                ];
            }

            $dateAttr = isset($attributes[$fName]) && ($attributes[$fName] instanceof DateAttribute || $attributes[$fName] instanceof DateAttribute);
            if (array_key_exists($fName, $attributes) && $dateAttr && is_string($fValue)) {
                $from = $to = $fValue;
                if (self::str($fValue)->contains(':')) {
                    list($from, $to) = explode(':', $fValue);
                }

                if ($attributes[$fName] instanceof DateAttribute) {
                    $fValue = [
                        '$gte' => self::datetime($from)->setTime(0, 0, 0)->getMongoDate(),
                        '$lte' => self::datetime($to)->setTime(23, 59, 59)->getMongoDate()
                    ];
                } else {
                    $fValue = [
                        '$gte' => self::datetime($from)->setTime(0, 0, 0)->getTimestamp(),
                        '$lte' => self::datetime($to)->setTime(0, 0, 0)->getTimestamp()
                    ];
                }
            }

            $builtFilters[$fName] = $fValue;
        }

        return $builtFilters;
    }

    public function __call($name, $arguments)
    {
        if ($name == 'on') {
            $this->instanceCallbacks[$arguments[0]][] = $arguments[1];

            return null;
        }

        return parent::__call($name, $arguments);
    }

    public static function __callStatic($name, $arguments)
    {
        if ($name == 'on') {
            $className = get_called_class();
            static::$classCallbacks[$className][$arguments[0]][] = $arguments[1];
        }
    }

    protected function processCallbacks($eventName, ...$params)
    {
        $className = get_called_class();
        $classes = array_values([$className] + class_parents($className));
        foreach ($classes as $class) {
            $callbacks = static::$classCallbacks[$class][$eventName] ?? [];
            foreach ($callbacks as $callback) {
                // Static callbacks require an instance of entity that triggered the event as first parameter
                $callback($this, ...$params);
            }

            if ($class == 'Apps\Core\Php\DevTools\Entity\AbstractEntity') {
                $callbacks = $this->instanceCallbacks[$eventName] ?? [];
                foreach ($callbacks as $callback) {
                    $callback(...$params);
                }

                return;
            }
        }
    }

    private function processDelete($permanent)
    {
        /**
         * Check for many2many attributes and make sure related Entity has a corresponding many2many attribute defined.
         * If not - deleting is not allowed.
         */

        /* @var $attr Many2ManyAttribute */
        $thisClass = get_class($this);
        foreach ($this->getAttributes() as $attrName => $attr) {
            if ($this->isInstanceOf($attr, AttributeType::MANY2MANY)) {
                $foundMatch = false;
                $relatedClass = $attr->getEntity();
                $relatedEntity = new $relatedClass;
                /* @var $relAttr Many2ManyAttribute */
                foreach ($relatedEntity->getAttributes() as $relAttr) {
                    if ($this->isInstanceOf($relAttr, AttributeType::MANY2MANY) && $this->isInstanceOf($this, $relAttr->getEntity())) {
                        $foundMatch = true;
                    }
                }

                if (!$foundMatch) {
                    throw new EntityException(EntityException::NO_MATCHING_MANY2MANY_ATTRIBUTE_FOUND, [
                        $thisClass,
                        $relatedClass,
                        $attrName
                    ]);
                }
            }
        }

        /**
         * First check all one2many records to see if deletion is restricted
         */
        $deleteAttributes = [];
        foreach ($this->getAttributes() as $key => $attr) {
            if ($this->isInstanceOf($attr, AttributeType::ONE2MANY)) {
                /* @var $attr One2ManyAttribute */
                if ($attr->getOnDelete() == 'restrict' && $this->getAttribute($key)->getValue()->count() > 0) {
                    throw new EntityException(EntityException::ENTITY_DELETION_RESTRICTED, [$key]);
                }
                $deleteAttributes[] = $key;
            }
        }

        /**
         * Delete many2many records
         */
        /*foreach ($this->getAttributes() as $attr) {
            // @var $attr Many2ManyAttribute
            if ($this->isInstanceOf($attr, AttributeType::MANY2MANY)) {
                $firstClassName = $this->extractClassName($attr->getParentEntity());
                $query = [$firstClassName => $this->id];
                // TODO: sta radim sa $permanent ovdje?
                $this->entity()->getDatabase()->delete($attr->getIntermediateCollection(), $query);
            }
        }*/

        /**
         * Delete one2many records
         */
        foreach ($deleteAttributes as $attr) {
            foreach ($this->getAttribute($attr)->getValue() as $item) {
                $item->delete($permanent);
            }
        }

        /**
         * Delete many2one records that are set to 'cascade'
         */
        foreach ($this->getAttributes() as $attr) {
            if ($this->isInstanceOf($attr, AttributeType::MANY2ONE) && $attr->getOnDelete() === 'cascade') {
                $value = $attr->getValue();
                if ($value && $value instanceof AbstractEntity) {
                    $value->delete($permanent);
                }
            }
        }

        /**
         * Delete $this if it is a permanent delete
         */
        if ($permanent) {
            $this->entity()->getDatabase()->delete(static::$entityCollection, ['_id' => $this->entity()->getDatabase()->id($this->id)]);

            static::entity()->remove($this);
        }

        return true;
    }
}