<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Webiny\Core\Entity;

use Webiny\Core\Traits\PlatformTrait;
use Webiny\Component\Entity\Attribute\AttributeAbstract;
use Webiny\Component\Entity\Entity;
use Webiny\Component\Entity\EntityException;
use Webiny\Component\EventManager\EventManagerTrait;
use Webiny\Core\Entity\Event\EntityDeleteEvent;
use Webiny\Core\Entity\Event\EntityEvent;

/**
 * EntityAbstract class is the main class to extend when creating your own entities
 *
 * @property string $id

 * Class EntityAbstract
 * @package Webiny\Core\Entity
 *
 * @property string $createdOn
 * @property string $modifiedOn
 */
abstract class EntityAbstract extends \Webiny\Component\Entity\EntityAbstract
{
    use PlatformTrait, EventManagerTrait;

    private static $protectedAttributes = [
        'id',
        'createdOn',
        'modifiedOn'
    ];

    final public static function install()
    {
        $indexes = static::entityIndexes();
        foreach ($indexes as $index) {
            if (self::isInstanceOf($index, '\Webiny\Component\Mongo\Index\IndexAbstract')) {
                Entity::getInstance()->getDatabase()->createIndex(static::$entityCollection, $index);
            }
        }

        $data = static::entityData();
        foreach ($data as $entityData) {
            $entity = new static;
            $entity->populate($entityData)->save();
        }
    }

    final public static function uninstall()
    {

    }

    /**
     * Remove given $fields from all instances of this entity
     *
     * @param array $fields
     */
    final public static function removeFields($fields = [])
    {
        /**
         * Unset protected attributes
         */
        $fields = array_diff($fields, self::$protectedAttributes);
        Entity::getInstance()
              ->getDatabase()
              ->update(static::$entityCollection, [], ['$unset' => array_flip($fields)], ['multiple' => true]);
    }

    protected static function entityIndexes()
    {
        return [];
    }

    protected static function entityData()
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
     * @inheritDoc
     */
    public static function find(array $conditions = [], array $order = [], $limit = 0, $page = 0)
    {
        if(count($order) == 0){
            $order['_id'] = -1;
        }
        return parent::find($conditions, $order, $limit, $page);
    }

    public function __construct()
    {
        parent::__construct();
        /**
         * Add the following built-in system attributes:
         * createdOn, modifiedOn, user
         */
        $this->attr('createdOn')->datetime()->setDefaultValue('now')->onSet(function(){
            return null;
        });
        $this->attr('modifiedOn')->datetime()->setAutoUpdate(true);
    }

    public function delete()
    {
        /**
         * Make sure the entity instance has an ID
         */
        if (!$this->exists()) {
            return false;
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

        return $deleted;
    }

    /**
     * @param $attribute
     *
     * @return EntityAttributeBuilder
     */
    public function attr($attribute)
    {
        return EntityAttributeBuilder::getInstance()->setContext($this->attributes, $attribute)->setEntity($this);
    }

    /**
     * Find entity by ID
     *
     * @param $id
     *
     * @return null|$this
     */
    public static function findById($id)
    {
        return parent::findById($id);
    }

    /**
     * Find entity by array of conditions
     *
     * @param array $conditions
     *
     * @return null|$this
     * @throws EntityException
     */
    public static function findOne(array $conditions = [])
    {
        return parent::findOne($conditions);
    }

    public static function meta()
    {
        $entity = new static();

        $data = [
            'class' => get_class($entity),
            'mask' => $entity::$entityMask
        ];
        /* @var $attr AttributeAbstract */
        foreach ($entity->getAttributes() as $attrName => $attr) {
            $data['attributes'][] = [
                'name'       => $attrName,
                'type'       => self::str(get_class($attr))->explode('\\')->last()->replace('Attribute', '')->caseLower()->val(),
                'validators' => join(',', $attr->getValidators()),
                'validationMessages' => $attr->getValidationMessages(),
                'defaultValue' => $attr->getDefaultValue()
            ];
        }

        return $data;
    }
}