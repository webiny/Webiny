<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\Entity;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Api\ApiExpositionTrait;
use Apps\Webiny\Php\Lib\Entity\EntityQuery\EntityQuery;
use Apps\Webiny\Php\Lib\Entity\EntityQuery\EntityQueryManipulator;
use Apps\Webiny\Php\Lib\Entity\EntityQuery\Filter;
use Apps\Webiny\Php\Lib\Entity\EntityQuery\QueryContainer;
use Apps\Webiny\Php\Lib\Entity\EntityQuery\Sorter;
use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Entities\User;
use Apps\Webiny\Php\RequestHandlers\ApiException;
use Webiny\Component\Entity\Attribute\AttributeType;
use Webiny\Component\Entity\Attribute\DateAttribute;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\Entity\Attribute\DateTimeAttribute;
use Webiny\Component\Entity\Attribute\Many2ManyAttribute;
use Webiny\Component\Entity\Attribute\Many2OneAttribute;
use Webiny\Component\Entity\Attribute\Many2OneAttribute as WebinyMany2OneAttribute;
use Webiny\Component\Entity\Attribute\One2ManyAttribute;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\Entity\EntityException;
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
 * @method void trigger (string $eventName, ...$params)
 * @method static void onExtend (\Closure $callback)
 * @method static void onExtendApi (\Closure $callback)
 * @method static void onExtendQuery (\Closure $callback)
 * @method static void onExtendIndexes (\Closure $callback)
 * @method static void onBeforeCreate (\Closure $callback)
 * @method static void onAfterCreate (\Closure $callback)
 * @method static void onBeforeUpdate (\Closure $callback)
 * @method static void onAfterUpdate (\Closure $callback)
 * @method static void onBeforeSave (\Closure $callback)
 * @method static void onAfterSave (\Closure $callback)
 * @method static void onBeforeDelete (\Closure $callback)
 * @method static void onAfterDelete (\Closure $callback)
 */
abstract class AbstractEntity extends \Webiny\Component\Entity\AbstractEntity
{
    use WebinyTrait, ApiExpositionTrait;

    protected static $classCallbacks = [];
    protected static $queryContainers = [];
    protected $indexes = [];
    protected $instanceCallbacks = [];

    const EVENT_NAMES = [
        'onExtend'        => ['static' => false],
        'onExtendApi'     => ['static' => false],
        'onExtendIndexes' => ['static' => true],
        'onExtendQuery'   => ['static' => true],
        'onBeforeCreate'  => ['static' => false],
        'onAfterCreate'   => ['static' => false],
        'onBeforeUpdate'  => ['static' => false],
        'onAfterUpdate'   => ['static' => false],
        'onBeforeSave'    => ['static' => false],
        'onAfterSave'     => ['static' => false],
        'onBeforeDelete'  => ['static' => false],
        'onAfterDelete'   => ['static' => false]
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
            /* @var $instance AbstractEntity */
            return $instance;
        }
        $mongo = static::entity()->getDatabase();

        $query = new EntityQuery(['_id' => $mongo->id($id)]);
        static::processEntityQuery($query, $options);

        if ($query->isAborted()) {
            return null;
        }

        $data = $mongo->findOne(static::$collection, $query->getConditions());
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
            /* @var $instance AbstractEntity */
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


    public static function find(array $conditions = [], array $sort = [], $limit = 0, $page = 0, $options = [])
    {
        $sort = self::parseOrderParameters($sort);

        $query = new EntityQuery($conditions, $sort, $limit, $page);

        static::processEntityQuery($query, $options);

        if ($query->isAborted()) {
            return new EntityCollection(get_called_class());
        }

        $parameters = [
            'conditions' => $query->getConditions(),
            'order'      => $query->getSorters(),
            'limit'      => $query->getLimit(),
            'offset'     => $query->getOffset()
        ];

        // Here we detect if we received keys in conditions and sorters that are from entities stored in another collections. If true,
        // we will automatically do joins (Mongo $lookup) on needed collections and immediately make querying easier.
        $instance = new static;
        $joins = [];

        foreach ($parameters['conditions'] as $path => $value) {
            self::processEntityQueryJoins($joins, $path, null, $instance);
        }

        foreach ($parameters['order'] as $path => $value) {
            self::processEntityQueryJoins($joins, $path, null, $instance);
        }

        // If we don't have joins to execute, just use the simple find() method.
        if (empty($joins)) {
            $find = array_values($parameters);
            $data = self::entity()->getDatabase()->find(static::$collection, ...$find);

            return new EntityCollection(get_called_class(), $data, $parameters);

        }

        // Otherwise, let's prepare the aggregation pipeline and execute.
        $basePipeline = [];
        foreach ($joins as $join) {
            $basePipeline[] = ['$lookup' => $join];
        }

        if (count($parameters['conditions'])) {
            $basePipeline[] = ['$match' => $parameters['conditions']];
        }

        $pipeline = $basePipeline;
        if (count($parameters['order'])) {
            $pipeline[] = ['$sort' => $parameters['order']];
        }

        $pipeline[] = ['$skip' => $parameters['offset']];
        $pipeline[] = ['$limit' => $parameters['limit']];
        $pipeline[] = ['$project' => ['_id' => 0, 'id' => 1]];

        $data = self::entity()->getDatabase()->aggregate(static::$collection, $pipeline);

        $collection = new EntityCollection(get_called_class(), $data, $parameters);


        $collection->setTotalCountCalculation(function () use ($basePipeline) {
            $basePipeline[] = ['$group' => ['_id' => null, 'total' => ['$sum' => 1], 'results' => ['$push' => '$$ROOT']]];
            $basePipeline[] = ['$project' => ['_id' => 0, 'total' => 1]];
            $count = self::entity()->getDatabase()->aggregate(static::$collection, $basePipeline)->toArray();

            return $count[0]['total'] ?? 0;
        });

        return $collection;
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
     * Get entity indexes
     *
     * @return IndexContainer
     */
    public static function getIndexes()
    {
        $indexContainer = new IndexContainer();
        static::entityIndexes($indexContainer);
        static::processStaticCallbacks('onExtendIndexes', $indexContainer);

        return $indexContainer;
    }

    /**
     * Create attribute
     * This method is overridden because we need to set the correct return type for better autocomplete
     *
     * @param string $attribute
     *
     * @return EntityAttributeContainer
     */
    public function attr($attribute)
    {
        return parent::attr($attribute);
    }

    public function __construct()
    {
        parent::__construct();

        /**
         * Add the following built-in system attributes:
         * createdOn, modifiedOn, deletedOn, deleted and user
         */
        $this->attr('createdOn')->datetime()->setDefaultValue('now')->setToArrayDefault();
        $this->attr('createdBy')->user()->onGet(function ($value) {
            if (!$this->exists() && !$value) {
                return $this->wAuth()->getUser();
            }

            return $value;
        });
        $this->attr('modifiedOn')->datetime()->onToDb(function ($value) {
            if ($this->exists() && !$this->deletedOn) {
                return $this->datetime()->getMongoDate();
            }

            return $value;
        });
        $this->attr('modifiedBy')->user()->onToDb(function ($value) {
            if ($this->exists() && !$this->deletedOn) {
                $user = $this->wAuth()->getUser();

                return $user ? $user->id : null;
            }

            return $value;
        });
        $this->attr('deletedOn')->datetime();
        $this->attr('deletedBy')->user();

        /**
         * Fire event for registering extra attributes
         */
        $this->trigger('onExtend');
    }

    /**
     * This will be called before trying to delete an entity. Here you can define your own business rules to allow/prevent deletion.
     * If you want to prevent deletion - throw an AppException
     *
     * @return bool
     * @throws AppException
     */
    public function canDelete()
    {
        return true;
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
            $this->deletedOn = $this->datetime()->getMongoDate();
            $this->deletedBy = $this->wAuth()->getUser();
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

    /**
     * Get array of entity indexes filter and sorter manipulators
     *
     * @param IndexContainer $indexes
     *
     * @return void
     */
    protected static function entityIndexes(IndexContainer $indexes)
    {
        $indexes->add(new SingleIndex('id', 'id', false, true));
        $indexes->add(new SingleIndex('createdOn', 'createdOn'));
        $indexes->add(new SingleIndex('createdBy', 'createdBy'));
        $indexes->add(new SingleIndex('deletedOn', 'deletedOn'));
    }

    /**
     * Get array of entity query filter and sorter manipulators
     *
     * @param QueryContainer $query
     *
     * @return void
     */
    protected static function entityQuery(QueryContainer $query)
    {
        // No base filters are applied to the query
    }

    /**
     * Define entity API
     *
     * @param ApiContainer $api An object used to defined the API
     *
     * @return void
     */
    protected function entityApi(ApiContainer $api)
    {
        /**
         * @api.name List records
         */
        $api->get('/', function () {
            $filters = $this->wRequest()->getFilters();
            $sorter = $this->wRequest()->getSortFields();

            $entities = $this->find($filters, $sorter, $this->wRequest()->getPerPage(), $this->wRequest()->getPage());

            return $this->apiFormatList($entities, $this->wRequest()->getFields());
        })->setCrud();

        /**
         * @api.name Get a record by ID
         */
        $api->get('{id}', function () {
            return $this->apiFormatEntity($this, $this->wRequest()->getFields());
        })->setCrud();

        /**
         * @api.name Create a new record
         */
        $api->post('/', function () {
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
        })->setCrud();

        /**
         * @api.name Update a record by ID
         */
        $api->patch('{id}', function () {
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
        })->setCrud();

        /**
         * @api.name Delete a record by ID
         */
        $api->delete('{id}', function () {
            try {
                $this->delete();

                return true;
            } catch (EntityException $e) {
                throw new ApiException('Failed to delete entity! ' . $e->getMessage(), $e->getCode(), 400);
            }
        })->setCrud();
    }

    /**
     * Initialize given ApiContainer
     *
     * @param ApiContainer $api
     */
    protected function initializeApi(ApiContainer $api)
    {
        $this->entityApi($api);
        $api->setEvent('onExtendApi');
        $this->processCallbacks('onExtendApi', $api);
        $api->setEvent(null);
    }

    protected function createEntityAttributeContainer()
    {
        return new EntityAttributeContainer($this);
    }

    /**
     * Format conditions and apply options
     *
     * @param EntityQuery $query
     * @param array       $options
     */
    protected static function processEntityQuery(EntityQuery $query, $options)
    {
        $options['includeDeleted'] = $options['includeDeleted'] ?? false;
        $options['onlyDeleted'] = $options['onlyDeleted'] ?? false;
        $options['entityFilters'] = $options['entityFilters'] ?? true;

        static::processEntityBaseFilters($query);
        if ($options['entityFilters']) {
            static::processEntityQueryFiltersSorters($query);
        }

        if (!$options['includeDeleted']) {
            $query->setCondition('deletedOn', null);
        } else {
            if ($options['onlyDeleted']) {
                $query->setCondition('deletedOn', ['$ne' => null]);
            }
        }
    }

    /**
     * @param EntityQuery $query
     */
    protected static function processEntityBaseFilters(EntityQuery $query)
    {
        $entity = new static;
        $attributes = $entity->getAttributes();
        foreach ($query->getConditions() as $fName => $fValue) {
            // Construct an $in statement only if filter value is index-based
            if (!(substr($fName, 0, 1) === "$") && is_array($fValue) && !count(array_filter(array_keys($fValue), 'is_string')) > 0) {
                $fValue = [
                    '$in' => $fValue
                ];
            }

            $dateAttr = isset($attributes[$fName]) && ($attributes[$fName] instanceof DateAttribute || $attributes[$fName] instanceof DateTimeAttribute);
            if (array_key_exists($fName, $attributes) && $dateAttr && is_string($fValue)) {
                $from = $to = $fValue;
                if (strpos($fValue, ':-:') !== false) {
                    list($from, $to) = explode(':-:', $fValue);
                } elseif (strpos($fValue, ':') !== false) {
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
     * Sets custom filters that can be sent to find and findOne methods
     *
     * @param EntityQuery|array $query
     *
     * @throws AppException
     */
    protected static function processEntityQueryFiltersSorters(EntityQuery $query)
    {
        // Check if QueryContainer already exists for this entity
        $class = get_called_class();
        $queryContainer = static::$queryContainers[$class] ?? null;
        if (!$queryContainer) {
            $queryContainer = new QueryContainer();
            static::$queryContainers[$class] = $queryContainer;
            static::entityQuery($queryContainer);
            static::processStaticCallbacks('onExtendQuery', $queryContainer);
        }

        $staticManipulators = [];

        /* @var EntityQueryManipulator $manipulator */
        foreach ($queryContainer as $manipulator) {
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
                    $manipulator($query);
                }
            }

            // If manipulator is Sorter, then we check if we received a sorter which it handles.
            if ($manipulator instanceof Sorter) {
                if ($query->hasSorter($manipulator->getName())) {
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
     * Returns $lookup statements for given key - used for doing Mongo joins for better sorting / query-ing abilities.
     *
     * @param                $neededJoins
     * @param                $path
     * @param string         $pathPrefix
     * @param AbstractEntity $entity
     */
    private static function processEntityQueryJoins(&$neededJoins, $path, $pathPrefix = '', AbstractEntity $entity)
    {
        $parts = explode('.', $path, 2);

        // To do a join, we must have a specific path. We don't want to do a join if we have received just 'brand' path.
        // On the other side, we will take into consideration fields like 'entity.xyz'.
        if (count($parts) > 1) {
            $attrName = array_shift($parts);

            try {
                $attr = $entity->getAttribute($attrName);
            } catch (\Exception $e) {
                $attr = null;
            }

            if ($attr instanceof WebinyMany2OneAttribute) {
                $class = $attr->getEntity();
                $attrName = $pathPrefix ? $pathPrefix . '.' . $attrName : $attrName;
                if (!isset($neededJoins[$attrName])) {
                    $neededJoins[$attrName] = [
                        'from'         => $class::getCollection(),
                        'localField'   => $attrName,
                        'as'           => $attrName,
                        'foreignField' => 'id'
                    ];
                }

                if (count($parts)) {
                    $pathPrefix = $pathPrefix ? '.' . $attrName : $attrName;
                    self::processEntityQueryJoins($neededJoins, $parts[0], $pathPrefix, new $class);
                }
            }
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

        if (array_key_exists($name, static::EVENT_NAMES)) {
            $this->instanceCallbacks[$name][] = $arguments[0];

            return null;
        }

        if ($name == 'trigger') {
            return $this->processCallbacks(...$arguments);
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

        if (array_key_exists($name, self::EVENT_NAMES)) {
            static::$classCallbacks[$className][$name][] = $arguments[0];

            return null;
        }

        if ($name == 'trigger') {
            return static::processStaticCallbacks(...$arguments);
        }
    }

    /**
     * Process entity instance callbacks.
     * Here we process both class and instance callbacks for `$this` entity instance
     *
     * @param string $eventName
     * @param array  $params
     *
     * @return array
     */
    protected function processCallbacks($eventName, ...$params)
    {
        $className = get_called_class();
        $classes = array_filter(array_values([$className] + class_parents($className)), function ($t) {
            return $this->str($t)->startsWith('Apps\\');
        });

        foreach ($classes as $class) {
            $callbacks = static::$classCallbacks[$class][$eventName] ?? [];
            foreach ($callbacks as $callback) {
                if (is_callable($callback)) {
                    $staticParams = $params;
                    // Check if callback requires an instance of entity that triggered the event
                    $rf = new \ReflectionFunction($callback);
                    $firstParameter = $rf->getParameters()[0] ?? null;
                    if ($firstParameter) {
                        // We must only execute the callback if $className matches or extends the parameter class
                        $requiredClassName = $firstParameter->getClass()->getName();
                        if ($requiredClassName !== $className && !is_subclass_of($className, $requiredClassName)) {
                            continue;
                        }
                        array_unshift($staticParams, $this);
                    }
                    // Execute callback
                    $callback(...$staticParams);
                }
            }

            if ($class == AbstractEntity::class) {
                $callbacks = $this->instanceCallbacks[$eventName] ?? [];
                foreach ($callbacks as $callback) {
                    if (is_callable($callback)) {
                        $callback(...$params);
                    }
                }

                break;
            }
        }
    }

    /**
     * Process callbacks marked as 'static' which means they can only be executed from a static context
     *
     * @param string $eventName
     * @param array  $params
     *
     * @return array
     */
    protected static function processStaticCallbacks($eventName, ...$params)
    {
        // Only events marked with `static` can be executed in static context
        if (!static::EVENT_NAMES[$eventName]['static'] ?? false) {
            return [];
        }

        // We need to get the entire inheritance tree and process callbacks for each class in the tree
        $className = get_called_class();
        $classes = array_filter(array_values([$className] + class_parents($className)), function ($t) {
            return static::str($t)->startsWith('Apps\\');
        });

        foreach ($classes as $class) {
            $callbacks = static::$classCallbacks[$class][$eventName] ?? [];
            foreach ($callbacks as $callback) {
                if (is_callable($callback)) {
                    $callback(...$params);
                }
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
                if ($attr->getOnDelete() == 'ignore') {
                    continue;
                }

                /* @var $attr One2ManyAttribute */
                if ($attr->getOnDelete() == 'restrict' && $this->getAttribute($key)->getValue()->count() > 0) {
                    throw new EntityException(EntityException::ENTITY_DELETION_RESTRICTED, [$key]);
                }
                $one2manyDelete[] = $attr;
            }

            if ($this->isInstanceOf($attr, AttributeType::MANY2ONE)) {
                /* @var $attr Many2OneAttribute */
                if ($attr->getOnDelete() === 'cascade') {
                    $many2oneDelete[] = $attr;
                }
                continue;
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
            $this->entity()->getDatabase()->delete(static::$collection, ['_id' => $this->entity()->getDatabase()->id($this->id)]);

            static::entity()->remove($this);
        }

        return true;
    }
}
