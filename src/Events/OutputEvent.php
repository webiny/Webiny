<?php
namespace Webiny\Core\Events;

use Webiny\Component\EventManager\Event;


/**
 * Class Output
 * @package Platform
 */
class OutputEvent extends Event
{

    public function setOutput($output)
    {
        $this->output = $output;
    }

    public function getOutput()
    {
        return $this->output;
    }
}