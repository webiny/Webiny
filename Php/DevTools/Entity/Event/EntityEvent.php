<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\DevTools\Entity\Event;

use Webiny\Component\EventManager\Event;
use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;

/**
 * This class is passed along the following AbstractEntity events:
 *
 * - BeforeSave
 * - AfterSave
 * - Extend
 */
class EntityEvent extends Event
{

    /**
     * @var AbstractEntity
     */
    private $entity;


    /**
     * Base constructor.
     */
    function __construct(AbstractEntity $entity) {
        $this->entity = $entity;

        parent::__construct();
    }

    /**
     * Returns an instance of AbstractEntity
     *
     * @return AbstractEntity
     */
    public function getEntity() {
        return $this->entity;
    }
}