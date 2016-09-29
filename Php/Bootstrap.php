<?php
namespace Apps\Core\Php;

use Apps\Core\Php\DevTools\AbstractBootstrap;
use Apps\Core\Php\Entities\User;
use Webiny\Component\Entity\Entity;
use Webiny\Component\StdLib\StdObject\DateTimeObject\DateTimeObject;

class Bootstrap extends AbstractBootstrap
{
    public function run(PackageManager\App $app)
    {
        $this->addAppRoute('/^\/' . $this->wConfig()->get('Application.Backend') . '/', 'Core:Templates/Webiny.tpl', 380);

        $entityConfig = Entity::getConfig();
        $entityConfig->mergeWith([
            'Attributes' => [
                'many2many' => '\Apps\Core\Php\DevTools\Entity\Attributes\Many2ManyAttribute'
            ]
        ]);
        Entity::setConfig($entityConfig);

        /**
         * @see http://php.net/manual/en/mongodb.setprofilinglevel.php
         */
        if (!$this->wIsProduction()) {
            $this->wDatabase()->command(['profile' => 2]);
        }

        User::onActivity(function (User $user) {
            $user->lastActive = new DateTimeObject('now');
            $user->save();
        });

        User::onLoginSuccess(function (User $user) {
            $user->lastActive = new DateTimeObject('now');
            $user->lastLogin = $user->lastActive;
            $user->save();
        });
    }
}