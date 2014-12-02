<?php
namespace Platform\Events;

use Webiny\Component\EventManager\Event;


/**
 * Class Output
 * @package Platform
 */
class OutputEvent extends Event
{

    public function setOutput($output)
    {
        $this->_output = $output;
    }

    public function getOutput()
    {
        return $this->_output;
    }
}