<?php
namespace Apps\Core\Php;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Webiny\Component\Mailer\Mailer;

class Bootstrap
{
    use DevToolsTrait;

    public function handle()
    {
        $appConfig = $this->wApps('Core')->getConfig();
        Mailer::setConfig($appConfig->get('Mailer', []));
    }
}