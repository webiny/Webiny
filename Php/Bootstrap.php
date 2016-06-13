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
        $mailer = $appConfig->get('Mailer');
        if ($mailer) {
            Mailer::setConfig($mailer);
        }

        /**
         * @see http://php.net/manual/en/mongodb.setprofilinglevel.php
         */
        $this->wDatabase()->command(['profile' => 2]);
    }
}