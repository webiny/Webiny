<?php
namespace Apps\Core\Php;

use Apps\Core\Php\DevTools\BootstrapTrait;
use Apps\Core\Php\Entities\User;
use Webiny\Component\Mailer\Mailer;
use Webiny\Component\StdLib\StdObject\DateTimeObject\DateTimeObject;

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

        User::onActivity(function(User $user){
            $user->lastActive = new DateTimeObject('now');
            $user->save();
        });

        User::onLoginSuccess(function(User $user){
            $user->lastActive = new DateTimeObject('now');
            $user->lastLogin = $user->lastActive;
            $user->save();
        });
    }
}