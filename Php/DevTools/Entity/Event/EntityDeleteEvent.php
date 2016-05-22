<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools\Entity\Event;

/**
 * This class is passed along with the events fired by Entity delete() method:
 * - BeforeDelete
 * - AfterDelete
 */
class EntityDeleteEvent extends EntityEvent
{

    private $deletePrevented = false;
    private $eventResult = false;

    /**
     * Set delete prevented flag
     * If true, entity delete() method will not delete the event entity
     *
     * @param bool $flag
     *
     * @return $this
     */
    public function setDeletePrevented($flag = true) {
        $this->deletePrevented = $flag;

        return $this;
    }

    /**
     * Is delete of event entity prevented?
     * @return bool
     */
    public function getDeletePrevented() {
        return $this->deletePrevented;
    }

    /**
     * Set event result to be returned from entity delete() method if delete is prevented
     *
     * @param mixed $data
     *
     * @return $this
     */
    public function setEventResult($data = false) {
        $this->eventResult = $data;

        return $this;
    }

    /**
     * Get event result<br>
     * Used only if delete is prevented
     *
     * @return mixed
     */
    public function getEventResult() {
        return $this->eventResult;
    }
}