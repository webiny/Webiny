<?php
namespace Apps\Core\Layout\Php\Handlers;

use Webiny\Component\Config\ConfigTrait;
use Webiny\Component\Storage\Directory\LocalDirectory;
use Webiny\Component\Storage\Driver\Local\Local;
use Webiny\Component\Storage\Storage;
use Webiny\Component\Storage\StorageTrait;
use Webiny\Platform\Bootstrap\App;
use Webiny\Platform\Bootstrap\Generators\BackendBootstrap;
use Webiny\Platform\Bootstrap\Module;
use Webiny\Platform\Builders\DevelopmentBuilder;
use Webiny\Platform\Responses\HtmlResponse;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Platform\Traits\TemplateEngineTrait;
use Webiny\Component\EventManager\Event;
use Webiny\Component\StdLib\StdLibTrait;

class RenderApp
{
    use StdLibTrait, PlatformTrait, TemplateEngineTrait, ConfigTrait, StorageTrait;

    public function handle(Event $event)
    {
        if ($this->getPlatform()->getEnvironment()->isDevelopment()) {
            /* @var $app App */
            foreach ($this->getPlatform()->getApps() as $app) {
                $builder = new DevelopmentBuilder();
                $builder->setAppsStorage($this->storage('Apps'))->buildApp($app);
            }
        }

        $bootstrapGenerator = new BackendBootstrap();
        $bootstrapGenerator->generateBootstrapFile();

        $html = $this->templateEngine()->fetch($this->getModule()->getTemplate('Master.tpl'));

        return new HtmlResponse($html);
    }
}