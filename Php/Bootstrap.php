<?php
namespace Apps\Core\Php;

use Apps\Core\Php\DevTools\BootstrapTrait;
use Webiny\Component\Mailer\Mailer;

class Bootstrap
{
    use BootstrapTrait;

    public function run(PackageManager\App $app)
    {
        $mailer = $app->getConfig()->get('Mailer');
        if ($mailer) {
            Mailer::setConfig($mailer);
        }

        /**
         * @see http://php.net/manual/en/mongodb.setprofilinglevel.php
         */
        $this->wDatabase()->command(['profile' => 2]);
    }
}