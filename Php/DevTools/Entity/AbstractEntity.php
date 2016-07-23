<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools\Entity;

use Apps\Core\Php\Dispatchers\ApiExpositionTrait;
use Webiny\Component\Entity\Attribute\AbstractAttribute;
use Webiny\Component\Entity\Attribute\DateAttribute;
use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\Event\EntityDeleteEvent;
use Apps\Core\Php\DevTools\Entity\Event\EntityEvent;
use Webiny\Component\Entity\Attribute\Many2OneAttribute;
use Webiny\Component\Entity\Attribute\One2ManyAttribute;
use Webiny\Component\Entity\Entity;
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
 */
abstract class AbstractEntity extends \Webiny\Component\Entity\AbstractEntity
{
    use DevToolsTrait, ApiExpositionTrait;

    protected static $callbacks = [];
    protected $indexes = [];

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
        $this->attr('createdOn')->datetime()->setDefaultValue('now');
        $this->index(new SingleIndex('createdOn', 'createdOn'));

        $this->attr('modifiedOn')->datetime()->setAutoUpdate(true);

        /*$this->api('POST', 'restore/{restore}', function ($restore) {
            return $this->restore($restore)->toArray();
        });*/

        /**
         * Fire event for registering extra attributes
         */
        $this->processCallbacks('onExtend', new EntityEvent($this));
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
        $event = new EntityDeleteEvent($this);
        $this->processCallbacks('onBeforeDelete', $event);

        /**
         * If delete was prevented in some event handler, return event result (false by default)
         */
        if ($event->getDeletePrevented()) {
            return $event->getEventResult();
        }

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
            $this->processCallbacks('onAfterDelete', $event);
        }

        return $deleted;
    }

    public function save()
    {
        $event = new EntityEvent($this);
        $this->processCallbacks('onBeforeSave', $event);
        $save = parent::save();
        $this->processCallbacks('onAfterSave', $event);

        return $save;
    }

    public static function trigger($eventName, ...$params)
    {
        static::processCallbacks($eventName, ...$params);
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


        foreach ($entity->getApiMethods() as $httpMethod => $methods) {
            /* @var $method \Apps\Core\Php\Dispatchers\ApiMethod */
            foreach ($methods as $pattern => $method) {
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

    protected static function on($eventName, $callback)
    {
        $className = get_called_class();
        static::$callbacks[$className][$eventName][] = $callback;
    }

    protected static function processCallbacks($eventName, ...$params)
    {
        $className = get_called_class();

        $classes = array_values([$className] + class_parents($className));
        foreach ($classes as $class) {
            $callbacks = static::$callbacks[$class][$eventName] ?? [];
            foreach ($callbacks as $callback) {
                $callback(...$params);
            }

            if ($class == 'Apps\Core\Php\DevTools\Entity\AbstractEntity') {
                return;
            }
        }
    }
}