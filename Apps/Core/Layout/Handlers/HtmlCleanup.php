<?php
namespace Apps\Core\Layout\Handlers;

use Webiny\Platform\Events\OutputEvent;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Component\StdLib\StdLibTrait;

class HtmlCleanup
{
    use StdLibTrait, PlatformTrait;

    public function handle(OutputEvent $event)
    {
        $event->setOutput(preg_replace('/<--.*?-->/', '', $event->getOutput()));
    }
}