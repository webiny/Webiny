<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools\Entity;

use Apps\Core\Php\Dispatchers\ApiExpositionTrait;
use Apps\Core\Php\RequestHandlers\ApiException;
use Webiny\Component\Entity\Attribute\AbstractAttribute;
use Webiny\Component\Entity\Attribute\DateAttribute;
use Apps\Core\Php\DevTools\WebinyTrait;
use Webiny\Component\Entity\Attribute\Many2OneAttribute;
use Webiny\Component\Entity\Attribute\One2ManyAttribute;
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
 * @property DateTimeObject $modifiedOn
 * @method void on (string $eventName, \Closure $callback)
 */
abstract class AbstractEntity extends \Webiny\Component\Entity\AbstractEntity
{
    use WebinyTrait, ApiExpositionTrait;

    protected $indexes = [];
    protected $instanceCallbacks = [];
    protected static $classCallbacks = [];

    /**
     * Restore entity from archive.
     * Entity is inserted back to original collection(s) with all IDs preserved.
     *
     * @param $id
     *
     * @return null|\Webiny\Component\Entity\AbstractEntity AbstractEntity instance on success, or NULL on failure
     */
    public static function restore($id)
    {
        $archiver = Archiver::getInstance();
        $entity = $archiver->restore(get_called_class(), $id);
        if ($entity && $entity->save()) {
            $archiver->remove(get_called_class(), $id);
        }

        return $entity;
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

    /**
     * Get createdOn attribute
     * @return DateAttribute
     */
    public function getCreatedOn()
    {
        return $this->getAttribute('createdOn');
    }

    /**
     * Get modifiedOn attribute
     * @return DateAttribute
     */
    public function getModifiedOn()
    {
        return $this->getAttribute('modifiedOn');
    }

    public function __construct()
    {
        parent::__construct();
        $this->apiMethods = $this->arr();

        /**
         * Add the following built-in system attributes:
         * createdOn, modifiedOn, deletedOn, deleted and user
         */
        $this->attr('createdOn')->datetime()->setDefaultValue('now')->setToArrayDefault();
        $this->index([
            new SingleIndex('id', 'id', false, true),
            new SingleIndex('createdOn', 'createdOn')
        ]);


        $this->attr('modifiedOn')->datetime()->setAutoUpdate(true);

        /*$this->api('POST', 'restore/{restore}', function ($restore) {
            return $this->restore($restore)->toArray();
        });*/

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
        $this->api('GET', '/{id}', function () {
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
        $this->api('PATCH', '/{id}', function () {
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
        $this->api('DELETE', '/{id}', function () {
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

    public function delete()
    {
        /**
         * Make sure the entity instance has an ID
         */
        if ($this->id == null) {
            return false;
        }

        /**
         * Fire "BeforeDelete" event
         */
        $this->trigger('onBeforeDelete');

        /**
         * Store entity to archive.
         * When "archive" method is called, it returns an "archive process id". After first call to "archive" method,
         * Archiver blocks further calls to that method until the entity that initiated archiving unblocks it by calling "unblock".
         * To perform unblocking, "archive process id" is required, to identify entity instance that initiated the archiving process.
         */
        // $archiveProcessId = Archiver::getInstance()->archive($this);
        $deleted = parent::delete();
        // Archiver::getInstance()->unblock($archiveProcessId);

        if ($deleted) {
            $this->trigger('onAfterDelete');
        }

        return $deleted;
    }

    public function save()
    {
        $this->trigger('onBeforeSave');
        $save = parent::save();
        $this->trigger('onAfterSave');

        return $save;
    }

    public function trigger($eventName, ...$params)
    {
        $this->processCallbacks($eventName, ...$params);
    }

    public static function onExtend($callback)
    {
        static::on('onExtend', $callback);
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

    public static function find(array $conditions = [], array $order = [], $limit = 0, $page = 0)
    {
        $conditions = self::prepareFilters($conditions);

        return parent::find($conditions, $order, $limit, $page);
    }

    /**
     * @param $id
     *
     * @return null|AbstractEntity
     */
    public static function findById($id)
    {
        return parent::findById($id);
    }

    /**
     * @param array $conditions
     *
     * @return null|AbstractEntity
     */
    public static function findOne(array $conditions = [])
    {
        return parent::findOne($conditions);
    }

    public static function meta()
    {
        $entity = new static();

        $data = [
            'class'      => get_class($entity),
            'mask'       => $entity::$entityMask,
            'relations'  => [],
            'attributes' => [],
            'methods'    => []
        ];

        $attributeType = function (AbstractAttribute $attr) {
            if ($attr instanceof Many2OneAttribute) {
                return 'many2one';
            }

            if ($attr instanceof One2ManyAttribute) {
                return 'one2many';
            }

            return self::str(get_class($attr))->explode('\\')->last()->replace('Attribute', '')->caseLower()->val();
        };

        /* @var $attr AbstractAttribute */
        foreach ($entity->getAttributes() as $attrName => $attr) {
            $attrData = [
                'name'         => $attrName,
                'type'         => self::str(get_class($attr))->explode('\\')->last()->replace('Attribute', '')->caseLower()->val(),
                //'validators'         => join(',', $attr->getValidators()), // TODO: need to detect closure validators
                //'validationMessages' => $attr->getValidationMessages(),
                'defaultValue' => $attr->getDefaultValue()
            ];

            if ($attr instanceof Many2OneAttribute || $attr instanceof One2ManyAttribute) {
                $data['relations'][] = [
                    'target' => self::str($attr->getEntity())->replace('\\', '.')->trimLeft('.')->val(),
                    'type'   => $attributeType($attr)
                ];
            }

            $data['attributes'][] = $attrData;
        }

        $crudPatterns = [
            '/.get',
            '{id}.get',
            '/.post',
            '{id}.patch',
            '{id}.delete'
        ];

        foreach ($entity->getApiMethods() as $httpMethod => $methods) {
            /* @var $method \Apps\Core\Php\Dispatchers\ApiMethod */
            foreach ($methods as $pattern => $method) {
                if (in_array($pattern . '.' . $httpMethod, $crudPatterns)) {
                    continue;
                }
                $data['methods'][] = [
                    'key'        => $pattern . '.' . $httpMethod,
                    'httpMethod' => $httpMethod,
                    'pattern'    => $pattern,
                    'url'        => $method->getUrl()
                ];
            }
        }

        return $data;
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
        array_unshift($params, $this);
        foreach ($classes as $class) {
            $callbacks = static::$classCallbacks[$class][$eventName] ?? [];
            foreach ($callbacks as $callback) {
                $callback(...$params);
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
}