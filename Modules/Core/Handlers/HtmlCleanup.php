<?php
namespace Modules\Core\Handlers;

use Platform\Events\OutputEvent;
use Platform\Traits\AppTrait;
use Webiny\Component\StdLib\StdLibTrait;

class HtmlCleanup
{
    use StdLibTrait, AppTrait;

    public function handle(OutputEvent $event)
    {
        $event->setOutput(preg_replace('/<--.*?-->/', '', $event->getOutput()));
    }
}