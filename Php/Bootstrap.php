<?php

namespace Apps\Webiny\Php;

use Apps\Webiny\Php\DevTools\Validators\Password;
use Apps\Webiny\Php\Entities\User;
use Webiny\Component\StdLib\StdObject\DateTimeObject\DateTimeObject;

class Bootstrap extends \Apps\Webiny\Php\DevTools\LifeCycle\Bootstrap
{
    public function run(PackageManager\App $app)
    {
        parent::run($app);
        $this->addAppRoute('/^\/welcome/', 'Webiny:Templates/Welcome.tpl');
        $this->addAppRoute('/^\/' . $this->wConfig()->get('Application.Backend') . '/', 'Webiny:Templates/Backend.tpl', 380);

        User::onActivity(function (User $user) {
            $user->lastActive = new DateTimeObject('now');
            $user->save();
        });

        User::onLoginSuccess(function (User $user) {
            $user->lastActive = new DateTimeObject('now');
            $user->lastLogin = $user->lastActive;
            $user->save();
        });

        // Configure basic password validator
        $regex = "/^.{8,}$/";
        $message = "Password must contain at least 8 characters";
        $this->wValidation()->addValidator(new Password($regex, $message));
    }
}