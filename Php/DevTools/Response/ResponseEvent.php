<?php
namespace Apps\Core\Php\DevTools\Response;

use Webiny\Component\EventManager\Event;


/**
 * Class ResponseEvent
 */
class ResponseEvent extends Event
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