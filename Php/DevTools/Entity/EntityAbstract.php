<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools\Entity;

use Apps\Core\Php\Dispatchers\ApiExpositionTrait;
use Webiny\Component\Entity\Attribute\AttributeAbstract;
use Webiny\Component\Entity\Attribute\DateAttribute;
use Webiny\Component\Entity\Attribute\DateTimeAttribute;
use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\Event\EntityDeleteEvent;
use Apps\Core\Php\DevTools\Entity\Event\EntityEvent;
use Webiny\Component\Entity\Attribute\Many2OneAttribute;
use Webiny\Component\Entity\Attribute\One2ManyAttribute;

/**
 * EntityAbstract class is the main class to extend when creating your own entities
 */
abstract class EntityAbstract extends \Webiny\Component\Entity\EntityAbstract
{
    use DevToolsTrait, ApiExpositionTrait;

    private static $protectedAttributes = [
        'id',
        'createdOn',
        'modifiedOn'
    ];

    final public static function wInstall()
    {
        $indexes = []; //static::entityIndexes();
        foreach ($indexes as $index) {
            if (self::isInstanceOf($index, '\Webiny\Component\Mongo\Index\IndexAbstract')) {
                Entity::getInstance()->getDatabase()->createIndex(static::$entityCollection, $index);
            }
        }
    }

    final public static function wUninstall()
    {

    }

    /**
     * Remove given $fields from all instances of this entity
     *
     * @param array $fields
     */
    final public static function wRemoveFields($fields = [])
    {
        /**
         * Unset protected attributes
         */
        $fields = array_diff($fields, self::$protectedAttributes);
        self::wDatabase()->update(static::$entityCollection, [], ['$unset' => array_flip($fields)], ['multiple' => true]);
    }

    /**
     * Get entity indexes
     * @return array
     */
    protected static function entityIndexes()
    {
        return [];
    }

    /**
     * Restore entity from archive.
     * Entity is inserted back to original collection(s) with all IDs preserved.
     *
     * @param $id
     *
     * @return null|\Webiny\Component\Entity\EntityAbstract EntityAbstract instance on success, or NULL on failure
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
     * Get createdOn attribute
     * @return DateTimeAttribute
     */
    public function getCreatedOn()
    {
        return $this->getAttribute('createdOn');
    }

    /**
     * Get modifiedOn attribute
     * @return DateTimeAttribute
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
        $this->attr('modifiedOn')->datetime()->setAutoUpdate(true);

        /*$this->api('POST', 'restore/{restore}', function ($restore) {
            return $this->restore($restore)->toArray();
        });*/

        /**
         * Fire event for registering extra attributes
         */
        $this->wEvents()->fire($this->getEventName() . '.Extend', new EntityEvent($this));
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
        $this->wEvents()->fire($this->getEventName() . '.BeforeDelete', $event);

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

        /**
         * Fire "AfterDelete" event
         */
        if ($deleted) {
            $this->wEvents()->fire($this->getEventName() . '.AfterDelete', $event);
        }

        return $deleted;
    }

    public function save()
    {
        $event = new EntityEvent($this);
        $this->wEvents()->fire($this->getEventName() . '.BeforeSave', $event);
        $save = parent::save();
        $this->wEvents()->fire($this->getEventName() . '.AfterSave', $event);

        return $save;
    }

    public static function find(array $conditions = [], array $order = [], $limit = 0, $page = 0)
    {
        $conditions = self::prepareFilters($conditions);

        return parent::find($conditions, $order, $limit, $page);
    }

    /**
     * @param $id
     *
     * @return null|EntityAbstract
     */
    public static function findById($id)
    {
        return parent::findById($id);
    }

    /**
     * @param array $conditions
     *
     * @return null|EntityAbstract
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

        $attributeType = function (AttributeAbstract $attr) {
            if ($attr instanceof Many2OneAttribute) {
                return 'many2one';
            }

            if ($attr instanceof One2ManyAttribute) {
                return 'one2many';
            }

            return self::str(get_class($attr))->explode('\\')->last()->replace('Attribute', '')->caseLower()->val();
        };

        /* @var $attr AttributeAbstract */
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

            $dateAttr = isset($attributes[$fName]) && ($attributes[$fName] instanceof DateTimeAttribute || $attributes[$fName] instanceof DateAttribute);
            if (array_key_exists($fName, $attributes) && $dateAttr && is_string($fValue)) {
                $from = $to = $fValue;
                if (self::str($fValue)->contains(':')) {
                    list($from, $to) = explode(':', $fValue);
                }

                if ($attributes[$fName] instanceof DateTimeAttribute) {
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

    private function getEventName()
    {
        $classParts = $this->str(get_class($this))->explode('\\')->filter();
        $eventName = $classParts[1] . '.' . $classParts->last();

        return $eventName;
    }
}