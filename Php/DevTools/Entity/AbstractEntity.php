<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\DevTools\Entity;

use Apps\Webiny\Php\DevTools\Entity\EntityQuery\EntityQuery;
use Apps\Webiny\Php\DevTools\Entity\EntityQuery\EntityQueryManipulator;
use Apps\Webiny\Php\DevTools\Entity\EntityQuery\Filter;
use Apps\Webiny\Php\DevTools\Entity\EntityQuery\Sorter;
use Apps\Webiny\Php\DevTools\Exceptions\AppException;
use Apps\Webiny\Php\Dispatchers\ApiExpositionTrait;
use Apps\Webiny\Php\Entities\User;
use Apps\Webiny\Php\RequestHandlers\ApiException;
use Webiny\Component\Entity\Attribute\AttributeType;
use Webiny\Component\Entity\Attribute\DateAttribute;
use Apps\Webiny\Php\DevTools\WebinyTrait;
use Webiny\Component\Entity\Attribute\DateTimeAttribute;
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
 * @method static void onExtend (\Closure $callback)
 * @method static void onBeforeCreate (\Closure $callback)
 * @method static void onAfterCreate (\Closure $callback)
 * @method static void onBeforeUpdate (\Closure $callback)
 * @method static void onAfterUpdate (\Closure $callback)
 * @method static void onBeforeSave (\Closure $callback)
 * @method static void onAfterSave (\Closure $callback)
 * @method static void onBeforeDelete (\Closure $callback)
 * @method static void onAfterDelete (\Closure $callback)
 * @package Apps\Webiny\Php\DevTools\Entity
 */
abstract class AbstractEntity extends \Webiny\Component\Entity\AbstractEntity
{
    use WebinyTrait, ApiExpositionTrait;

    protected $indexes = [];
    protected $instanceCallbacks = [];
    protected static $classCallbacks = [];
    const EVENT_NAMES = [
        'onExtend',
        'onBeforeCreate',
        'onAfterCreate',
        'onBeforeUpdate',
        'onAfterUpdate',
        'onBeforeSave',
        'onAfterSave',
        'onBeforeDelete',
        'onAfterDelete'
    ];

    /**
     * Get class callbacks
     *
     * @return array
     */
    public static function getClassCallbacks()
    {
        return self::$classCallbacks;
    }

    /**
     * Find entity by ID - deleted entities won't be included in search by default
     *
     * @param string $id
     *
     *
     * @param array  $options
     *
     * @return AbstractEntity|null
     * @throws EntityException
     */
    public static function findById($id, $options = [])
    {
        if (!$id || !static::entity()->getDatabase()->isId($id)) {
            return null;
        }

        $instance = static::entity()->get(get_called_class(), $id);
        if ($instance) {
            return $instance;
        }
        $mongo = static::entity()->getDatabase();

        $query = new EntityQuery(['_id' => $mongo->id($id)]);
        static::processEntityQuery($query, $options);

        if ($query->isAborted()) {
            return null;
        }

        $data = $mongo->findOne(static::$entityCollection, $query->getConditions());
        if (!$data) {
            return null;
        }
        $instance = new static;
        $data['__webiny_db__'] = true;
        $instance->populate($data);

        return static::entity()->add($instance);
    }

    /**
     * Find one record by given conditions
     *
     * @param array $conditions
     * @param array $options
     *
     * @return AbstractEntity|null
     */
    public static function findOne(array $conditions = [], $options = [])
    {
        // If ID was passed, then we check the cache. If we got something from it, then
        // we can use that entity because there cannot be two entities with the same ID.
        $id = $conditions['id'] ?? null;

        if ($id && static::entity()->getDatabase()->isId($id)) {
            $instance = static::entity()->get(get_called_class(), $id);
            if ($instance) {
                return $instance;
            }
        }

        $query = new EntityQuery($conditions);
        static::processEntityQuery($query, $options);

        if ($query->isAborted()) {
            return null;
        }

        return parent::findOne($query->getConditions());
    }

    /**
     * Find entities
     *
     * @param mixed $conditions
     *
     * @param array $sort Example: ['-name', '+title']
     * @param int   $limit
     * @param int   $page
     * @param array $options
     *
     * @return EntityCollection
     */
    public static function find(array $conditions = [], array $sort = [], $limit = 0, $page = 0, $options = [])
    {
        $query = new EntityQuery($conditions, $sort, $limit, $page);

        // Query manipulation with entityFilters (also entitySorters)
        static::processEntityQuery($query, $options);

        if ($query->isAborted()) {
            return new EntityCollection(get_called_class());
        }

        return parent::find($query->getConditions(), $query->getSorters(), $query->getLimit(), $query->getPage());
    }

    /**
     * Count records using given criteria
     *
     * @param array $conditions
     * @param array $options
     *
     * @return int
     *
     */
    public static function count(array $conditions = [], $options = [])
    {
        $query = new EntityQuery($conditions);
        static::processEntityQuery($query, $options);

        if ($query->isAborted()) {
            return 0;
        }

        return parent::count($query->getConditions());
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
            $user = $this->wAuth()->getUser();

            return $user instanceof AbstractEntity ? $user : null;
        });
        $this->attr('modifiedOn')->datetime()->onToDb(function ($value) {
            if ($this->exists() && !$this->deletedOn) {
                return $this->datetime()->getMongoDate();
            }

            return $value;
        });
        $this->attr('modifiedBy')->many2one()->setEntity($userClass)->onToDb(function ($value) {
            $user = $this->wAuth()->getUser();

            if ($this->exists() && !$this->deletedOn && $user) {
                if ($user instanceof AbstractEntity) {
                    return $user->id;
                }

                return null;
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
            return $this->apiFormatEntity($this, $this->wRequest()->getFields());
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

            return $this->apiFormatEntity($this, $this->wRequest()->getFields());
        });

        /**
         * @api.name Update a record by ID
         */
        $this->api('PATCH', '{id}', function () {
            try {
                $data = $this->wRequest()->getRequestData();
                $this->populate($data)->save();

                return $this->apiFormatEntity($this, $this->wRequest()->getFields());
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

        if (!$permanent) {
            $user = $this->wAuth()->getUser();
            $this->deletedOn = $this->datetime()->getMongoDate();
            $this->deletedBy = $user instanceof AbstractEntity ? $user : null;
            $this->save();
        }

        $this->trigger('onAfterDelete');

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
        $this->processingEvent = $eventName;
        $this->processCallbacks($eventName, ...$params);
        $this->processingEvent = null;
    }

    /**
     * Format conditions and apply options
     *
     * @param EntityQuery $query
     * @param array       $options
     *
     * @return array
     */
    protected static function processEntityQuery(EntityQuery $query, $options)
    {
        if (!isset($options['includeDeleted'])) {
            $options['includeDeleted'] = false;
        }

        if (!isset($options['entityFilters'])) {
            $options['entityFilters'] = true;
        }

        static::processEntityBaseFilters($query);
        if ($options['entityFilters']) {
            static::processEntityQueryManipulators($query);
        }

        if (!$options['includeDeleted']) {
            $query->setCondition('deletedOn', null);
        }
    }

    /**
     * @param EntityQuery $query
     */
    protected static function processEntityBaseFilters(EntityQuery $query)
    {
        $entity = new static;
        $attributes = $entity->getAttributes()->val();
        foreach ($query->getConditions() as $fName => $fValue) {
            // Construct an $in statement only if filter value is index-based
            if (!self::str($fName)->startsWith('$') && is_array($fValue) && !count(array_filter(array_keys($fValue), 'is_string')) > 0) {
                $fValue = [
                    '$in' => $fValue
                ];
            }

            $dateAttr = isset($attributes[$fName]) && ($attributes[$fName] instanceof DateAttribute || $attributes[$fName] instanceof DateTimeAttribute);
            if (array_key_exists($fName, $attributes) && $dateAttr && is_string($fValue)) {
                $from = $to = $fValue;
                if (self::str($fValue)->contains(':-:')) {
                    list($from, $to) = explode(':-:', $fValue);
                } elseif (self::str($fValue)->contains(':')) {
                    list($from, $to) = explode(':', $fValue);
                }

                if ($attributes[$fName] instanceof DateTimeAttribute) {
                    $fValue = [
                        '$gte' => self::datetime($from)->getMongoDate(),
                        '$lte' => self::datetime($to)->getMongoDate()
                    ];
                } elseif ($attributes[$fName] instanceof DateAttribute) {
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

            $query->setCondition($fName, $fValue);
        }
    }

    /**
     * Get array of entity query filter and sorter manipulators
     *
     * @return array
     */
    protected static function entityQuery()
    {
        return [];
    }

    /**
     * Sets custom filters that can be sent to find and findOne methods
     *
     * @param EntityQuery|array $query
     *
     * @throws AppException
     */
    protected static function processEntityQueryManipulators(EntityQuery $query)
    {
        $entityQueryManipulators = static::entityQuery();

        $staticManipulators = [];

        /* @var EntityQueryManipulator $manipulator */
        foreach ($entityQueryManipulators as $manipulator) {
            if (!($manipulator instanceof EntityQueryManipulator)) {
                continue;
            }

            if ($manipulator->getName() === '*') {
                $staticManipulators[] = $manipulator;
                continue;
            }

            // If manipulator is Filter, then we check if we received a condition which it handles.
            if ($manipulator instanceof Filter) {
                if ($query->hasCondition($manipulator->getName())) {
                    // We clone just so developer doesn't change the original query accidentally.
                    $manipulator($query);
                }
            }

            // If manipulator is Sorter, then we check if we received a sorter which it handles.
            if ($manipulator instanceof Sorter) {
                if ($query->hasSorter($manipulator->getName())) {
                    // We clone just so developer doesn't change the original query accidentally.
                    $manipulator($query);
                }
            }

            // If query was aborted in current manipulator, then we can immediately exit.
            if ($query->isAborted()) {
                return;
            }
        }

        // If we have a static filter, let's apply those too
        foreach ($staticManipulators as $staticManipulator) {
            $staticManipulator($query);
        }
    }

    /**
     * Execute magic __call
     * We need this to properly handle event callbacks and forward calls to attribute value getters
     *
     * @param $name
     * @param $arguments
     *
     * @return mixed
     */
    public function __call($name, $arguments)
    {
        if ($name == 'on') {
            $this->instanceCallbacks[$arguments[0]][] = $arguments[1];

            return null;
        }

        if (in_array($name, self::EVENT_NAMES)) {
            $this->instanceCallbacks[$name][] = $arguments[0];

            return null;
        }

        return parent::__call($name, $arguments);
    }

    /**
     * Execute magic __callStatic
     * We need this to properly handle event callbacks
     *
     * @param $name
     * @param $arguments
     *
     * @return null
     */
    public static function __callStatic($name, $arguments)
    {
        $className = get_called_class();
        if ($name == 'on') {
            static::$classCallbacks[$className][$arguments[0]][] = $arguments[1];

            return null;
        }

        if (in_array($name, self::EVENT_NAMES)) {
            static::$classCallbacks[$className][$name][] = $arguments[0];

            return null;
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
                if (is_callable($callback)) {
                    $callback($this, ...$params);
                }
            }

            if ($class == 'Apps\Webiny\Php\DevTools\Entity\AbstractEntity') {
                $callbacks = $this->instanceCallbacks[$eventName] ?? [];
                foreach ($callbacks as $callback) {
                    if (is_callable($callback)) {
                        $callback(...$params);
                    }
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
        $one2manyDelete = [];
        $many2oneDelete = [];
        $many2manyDelete = [];
        foreach ($this->getAttributes() as $key => $attr) {
            if ($this->isInstanceOf($attr, AttributeType::ONE2MANY)) {
                /* @var $attr One2ManyAttribute */
                if ($attr->getOnDelete() == 'restrict' && $this->getAttribute($key)->getValue()->count() > 0) {
                    throw new EntityException(EntityException::ENTITY_DELETION_RESTRICTED, [$key]);
                }
                $one2manyDelete[] = $attr;
            }

            if ($this->isInstanceOf($attr, AttributeType::MANY2ONE) && $attr->getOnDelete() === 'cascade') {
                $many2oneDelete[] = $attr;
            }

            if ($this->isInstanceOf($attr, AttributeType::MANY2MANY)) {
                $many2manyDelete[] = $attr;
            }
        }

        /**
         * Delete one2many records
         */
        foreach ($one2manyDelete as $attr) {
            foreach ($attr->getValue() as $item) {
                $item->delete($permanent);
            }
        }

        /**
         * Delete many2many records
         */
        foreach ($many2manyDelete as $attr) {
            $attr->unlinkAll($permanent);
        }

        /**
         * Delete many2one records that are set to 'cascade'
         */
        foreach ($many2oneDelete as $attr) {
            $value = $attr->getValue();
            if ($value && $value instanceof AbstractEntity) {
                $value->delete($permanent);
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
