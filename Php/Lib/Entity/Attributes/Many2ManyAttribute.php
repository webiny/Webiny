<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\Entity\Attributes;

use Apps\Webiny\Php\Lib\WebinyTrait;
use MongoDB\Driver\Exception\BulkWriteException;
use Webiny\Component\Entity\AbstractEntity;
use Webiny\Component\Entity\Entity;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\Mongo\Index\CompoundIndex;

/**
 * Many2ManyAttribute
 */
class Many2ManyAttribute extends \Webiny\Component\Entity\Attribute\Many2ManyAttribute
{
    use WebinyTrait;

    public function save()
    {
        $collectionName = $this->intermediateCollection;
        $firstClassName = $this->extractClassName($this->getParentEntity());
        $secondClassName = $this->extractClassName($this->getEntity());

        // Make sure indexes exist
        $indexOrder = [$firstClassName, $secondClassName];
        list($indexKey1, $indexKey2) = $this->arr($indexOrder)->sort()->val();

        $index = new CompoundIndex($collectionName, [
            $indexKey1 => 1,
            $indexKey2 => 1
        ], false, true);

        Entity::getInstance()->getDatabase()->createIndex($collectionName, $index, ['background' => true]);

        /**
         * Insert values
         */
        $existingIds = [];
        $firstEntityId = $this->getParentEntity()->id;
        foreach ($this->getValue() as $item) {
            if ($item instanceof AbstractEntity && !$item->exists()) {
                $item->save();
            }

            if ($item instanceof AbstractEntity) {
                $secondEntityId = $item->id;
            } else {
                $secondEntityId = $item;
            }

            $existingIds[] = $secondEntityId;
            $user = $this->wAuth()->getUser();
            $data = [
                'createdOn'      => $this->datetime()->getMongoDate(),
                'createdBy'      => $user ? $user->id : null,
                'deletedOn'      => null,
                'deletedBy'      => null,
                $firstClassName  => $firstEntityId,
                $secondClassName => $secondEntityId
            ];

            try {
                Entity::getInstance()->getDatabase()->insertOne($collectionName, $this->arr($data)->sortKey()->val());
            } catch (BulkWriteException $e) {
                // Unique index was hit and an exception is thrown - that's ok, means the values are already inserted
                continue;
            }
        }

        /**
         * Remove old links
         */
        $removeQuery = [
            $firstClassName  => $firstEntityId,
            $secondClassName => [
                '$nin' => $existingIds
            ],
            'deletedOn'      => null
        ];
        Entity::getInstance()->getDatabase()->delete($collectionName, $removeQuery);

        /**
         * The value of many2many attribute must be set to 'null' to trigger data reload on next access.
         * If this is not done, we may not have proper links between the 2 entities and it may seem as if data was missing.
         */
        $this->setValue(null);
    }

    public function unlink($item, $permanent = false)
    {
        // Unlink item
        $deleted = $this->unlinkItem($item, $permanent);
        // If values are already loaded - remove deleted item from loaded data set
        if (!$this->isNull($this->value)) {
            $this->value->removeItem($item);
        }

        return $deleted;
    }

    public function unlinkAll($permanent = false)
    {
        foreach ($this->getValue() as $value) {
            $this->unlinkItem($value, $permanent);
        }

        // Reset current value
        $this->value = new EntityCollection($this->getEntity());

        return true;
    }

    protected function load()
    {
        $firstClassName = $this->extractClassName($this->getParentEntity());
        $secondClassName = $this->extractClassName($this->getEntity());

        // Select related IDs from aggregation table
        $query = [
            $firstClassName => $this->getParentEntity()->id
        ];

        if ($this->getParentEntity()->deletedOn === null) {
            $query['deletedOn'] = null;
        }

        $relatedObjects = Entity::getInstance()->getDatabase()->find($this->intermediateCollection, $query, [$secondClassName => 1]);
        $relatedIds = [];
        foreach ($relatedObjects as $rObject) {
            $relatedIds[] = $rObject[$secondClassName];
        }

        // Find all related entities using $relatedIds
        $callable = [
            $this->getEntity(),
            'find'
        ];

        return call_user_func_array($callable, [['id' => ['$in' => $relatedIds]]]);
    }

    protected function unlinkItem($item, $permanent = false)
    {
        // Convert instance to entity ID
        if ($item instanceof AbstractEntity) {
            $item = $item->id;
        }

        $sourceEntityId = $this->getParentEntity()->id;

        if ($this->isNull($sourceEntityId) || $this->isNull($item)) {
            return false;
        }

        $firstClassName = $this->extractClassName($this->getParentEntity());
        $secondClassName = $this->extractClassName($this->getEntity());
        $query = $this->arr([
            $firstClassName  => $sourceEntityId,
            $secondClassName => $item
        ])->sortKey()->val();

        $user = $this->wAuth()->getUser();

        $update = [
            'deletedOn' => $this->datetime()->getMongoDate(),
            'deletedBy' => $user ? $user->id : null
        ];

        if (!$permanent) {
            $res = Entity::getInstance()->getDatabase()->update($this->intermediateCollection, $query, ['$set' => $update]);

            return $res->getModifiedCount() == 1;
        } else {
            $res = Entity::getInstance()->getDatabase()->delete($this->intermediateCollection, $query);

            return $res->getDeletedCount() == 1;
        }
    }
}