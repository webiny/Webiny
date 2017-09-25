<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib;

use Webiny\Component\EventManager\Event;
use Webiny\Component\EventManager\EventManager;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class that provides access to event manager.
 */
class Events
{
    use SingletonTrait, StdLibTrait;

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var array List of registered listeners.
     */
    private $listeners = [];


    private $registeredEventListeners = [];


    /**
     * Event manager base constructor.
     */
    protected function init()
    {
        $this->eventManager = EventManager::getInstance();
    }

    /**
     * Returns the internal array that holds all the register event listeners.
     *
     * @return array
     */
    public function getListeners()
    {
        return $this->listeners;
    }

    /**
     * Sets the value of internal array holding the event listeners.
     * Do not use this function, it is use to automatically populate the events from cache.
     *
     * @param array $listeners
     */
    public function setListeners(array $listeners)
    {
        $this->listeners = $listeners;
    }

    /**
     * Register an event handler.
     *
     * @param string          $event Event name.
     * @param string|callable $handler Handler, must be a valid callable.
     * @param int             $priority
     */
    public function listen($event, $handler, $priority = 300)
    {
        $this->listeners[$event][] = ['handler' => $handler, 'priority' => $priority];
    }

    /**
     * Fire an event.
     *
     * @param string   $event Event name.
     * @param array    $eventData
     * @param null     $resultType If specified, the event results will be filtered using given class/interface name
     * @param null|int $limit Limit to a number of valid results
     *
     * @return mixed Returns array of event results
     */
    public function fire($event, $eventData = [], $resultType = null, $limit = null)
    {
        if ($this->registerListeners($event)) {
            return $this->eventManager->fire($event, $eventData, $resultType, $limit);
        }
    }

    /**
     * This method does on-request registration of listeners.
     * Using the on-request moment, we do not initialize the event handlers until they are really needed.
     *
     * @param string $event Name of the event for which to initialize the handlers.
     *
     * @return bool
     * @throws \Exception
     */
    private function registerListeners($event)
    {
        // check if we have registered listeners for the given event
        if (!isset($this->listeners[$event])) {
            return false;
        }

        // check if we have already registered them
        if (isset($this->registeredEventListeners[$event])) {
            return true;
        }

        // register the listeners with the event
        foreach ($this->listeners[$event] as $config) {
            $listener = $config['handler'];
            $priority = $config['priority'];

            try {
                if (is_string($listener)) {
                    $listener = explode('::', $listener);
                    $this->eventManager->listen($event)->handler($listener[0])->method($listener[1])->priority($priority);
                } else {
                    $this->eventManager->listen($event)->handler($listener)->priority($priority);
                }
            } catch (\Exception $e) {
                throw new \Exception($e->getMessage() . " Event: " . $event . " handler: " . $listener[0] . " method:" . $listener[1]);
            }
        }

        // mark listeners as registered
        $this->registeredEventListeners[$event] = true;

        // return true so we can fire the event
        return true;
    }
}