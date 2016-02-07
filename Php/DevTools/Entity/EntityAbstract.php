<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\DevTools\Entity;

use Apps\Core\Php\Dispatchers\ApiExpositionTrait;
use Webiny\Component\Entity\Attribute\AttributeAbstract;
use Webiny\Component\Entity\Attribute\DateTimeAttribute;
use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\Event\EntityDeleteEvent;
use Apps\Core\Php\DevTools\Entity\Event\EntityEvent;

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

    protected function entityApi()
    {
        // Expose your methods to API in this method
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
        $this->apiMethods = $this->arr();
        $this->attributes = $this->arr();
        $this->attributeBuilder = new EntityAttributeBuilder($this, $this->attributes);
        parent::__construct();
        /**
         * Add the following built-in system attributes:
         * createdOn, modifiedOn, deletedOn, deleted and user
         */
        $this->attr('createdOn')->datetime()->setDefaultValue('now');
        $this->attr('modifiedOn')->datetime()->setDefaultValue('now')->setAutoUpdate(true);

        /**
         * Fire event for registering extra attributes
         */
        $this->wEvents()->fire($this->getEventName() . '.Extend', new EntityEvent($this));

        /**
         * Register entity API methods
         */
        $this->entityApi();
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
        $archiveProcessId = Archiver::getInstance()->archive($this);
        $deleted = parent::delete();
        Archiver::getInstance()->unblock($archiveProcessId);

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

    /**
     * @param $attribute
     *
     * @return EntityAttributeBuilder
     */
    public function attr($attribute)
    {
        return parent::attr($attribute);
    }

    public static function meta()
    {
        $entity = new static();

        $data = [
            'class' => get_class($entity),
            'mask'  => $entity::$entityMask
        ];

        /* @var $attr AttributeAbstract */
        foreach ($entity->getAttributes() as $attrName => $attr) {
            $data['attributes'][] = [
                'name'               => $attrName,
                'type'               => self::str(get_class($attr))->explode('\\')->last()->replace('Attribute', '')->caseLower()->val(),
                'validators'         => join(',', $attr->getValidators()),
                'validationMessages' => $attr->getValidationMessages(),
                'defaultValue'       => $attr->getDefaultValue()
            ];
        }

        return $data;
    }

    private function getEventName()
    {
        $classParts = $this->str(get_class($this))->explode('\\')->filter();
        $eventName = $classParts[1] . '.' . $classParts->last();

        return $eventName;
    }
}