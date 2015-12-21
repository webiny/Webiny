<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @link      http://www.webiny.com/wf-snv for the canonical source repository
 * @copyright Copyright (c) 2009-2013 Webiny LTD. (http://www.webiny.com)
 * @license   http://www.webiny.com/framework/license
 */

namespace Webiny\Core\Entity;

use Webiny\Component\Entity\Attribute\AttributeType;
use Webiny\Component\Mongo\MongoTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Archiver class stores entity into archive so it can be restored later if needed.
 * When doing restoration, all entity IDs and relations are preserved.
 *
 * @package Webiny\Core\Entity
 */
class Archiver
{
    use StdLibTrait, MongoTrait, SingletonTrait;

    private $collectionName = 'EntityArchive';

    private $archiveCallCount = 0;

    /**
     * @var EntityAbstract
     */
    protected $entity;

    /**
     * Build data for archive using given EntityAbstract and store it to archive collection
     *
     * @param EntityAbstract $entity Entity instance to archive
     *
     * @return int Archive process ID
     */
    public function archive(EntityAbstract $entity)
    {
        $this->archiveCallCount++;
        if ($this->archiveCallCount > 1) {
            return $this->archiveCallCount;
        }

        $this->entity = $entity;

        $archive = [
            'entityId'    => $this->entity->id,
            'entityClass' => get_class($this->entity),
            'data'        => $this->extractData($this->entity),
            'archivedAt'  => new \MongoDate(time())
        ];

        $this->mongo()->insert($this->collectionName, $archive);

        return $this->archiveCallCount;
    }

    public function unblock($archiveProcessId)
    {
        if ($this->archiveCallCount == $archiveProcessId) {
            $this->archiveCallCount = 0;
        }
    }

    /**
     * Restore entity from archive.
     *
     * @param string $class Entity class name
     * @param string $id    Entity instance id
     *
     * @return EntityAbstract|null
     */
    public function restore($class, $id)
    {
        $find = [
            'entityId'    => $id,
            'entityClass' => $class
        ];
        $archive = $this->mongo()->findOne($this->collectionName, $find);

        if (!$archive) {
            return null;
        }

        /* @var $entity EntityAbstract */
        $entity = new $class;

        $archive['data']['__webiny_db__'] = true;

        $entity->populate($archive['data']);
        return $entity;
    }

    /**
     * Remove record from the archive
     *
     * @param string $class Entity class name
     * @param string $id    Entity instance id
     */
    public function remove($class, $id)
    {
        $find = [
            'entityId'    => $id,
            'entityClass' => $class
        ];
        $this->mongo()->remove($this->collectionName, $find);
    }

    /**
     * Extract EntityAbstract data to array
     *
     * @param $entity
     *
     * @return array
     */
    public function extractData(EntityAbstract $entity)
    {
        $data = [];
        foreach ($entity->getAttributes() as $attr => $attrInstance) {
            $entityAttribute = $entity->getAttribute($attr);
            $entityAttributeValue = $entityAttribute->getValue();
            $isOne2Many = $this->isInstanceOf($entityAttribute, AttributeType::ONE2MANY);
            $isMany2Many = $this->isInstanceOf($entityAttribute, AttributeType::MANY2MANY);
            $isMany2One = $this->isInstanceOf($entityAttribute, AttributeType::MANY2ONE);
            $isArrayAttribute = $this->isInstanceOf($entityAttribute, AttributeType::ARR);
            $isDynamicAttribute = $this->isInstanceOf($entityAttribute, AttributeType::DYNAMIC);

            if ($isOne2Many) {
                $data[$attr] = [];
                foreach ($entityAttributeValue as $item) {
                    $attrDataExtractor = new static();
                    $data[$attr][] = $attrDataExtractor->extractData($item);
                }
            } elseif ($isMany2Many) {
                $data[$attr] = [];
                foreach ($entityAttributeValue as $item) {
                    $data[$attr][] = $item->getId()->getValue();
                }
            } else {
                $data[$attr] = $entityAttribute->getDbValue();
            }
        }

        return $data;
    }
}