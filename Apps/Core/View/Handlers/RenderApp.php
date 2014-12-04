<?php
namespace Apps\Core\View\Handlers;

use Webiny\Platform\Bootstrap\Generators\BackendBootstrap;
use Webiny\Platform\Responses\HtmlResponse;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Platform\Traits\TemplateEngineTrait;
use Webiny\Component\EventManager\Event;
use Webiny\Component\StdLib\StdLibTrait;

class RenderApp
{
    use StdLibTrait, PlatformTrait, TemplateEngineTrait;

    public function handle(Event $event)
    {
        $bootstrapGenerator = new BackendBootstrap();
        $bootstrapGenerator->generateBootstrapFile();

        $html = $this->templateEngine()->fetch($this->getModule()->getTemplate('Master.tpl'));
        return new HtmlResponse($html);
    }
}