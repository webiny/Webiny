<?php
namespace Modules\Core\Handlers;

use Platform\Responses\HtmlResponse;
use Platform\Traits\AppTrait;
use Platform\Traits\TemplateEngineTrait;
use Webiny\Component\EventManager\Event;
use Webiny\Component\StdLib\StdLibTrait;

class RenderApp
{
    use StdLibTrait, AppTrait, TemplateEngineTrait;

    public function handle(Event $event)
    {
        $html = $this->templateEngine()->fetch($this->getModule()->getAbsolutePath().'/Templates/Master.tpl');
        return new HtmlResponse($html);
    }
}