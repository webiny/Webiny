<?php

namespace Apps\Webiny\Php;

use Apps\Webiny\Php\Entities\ApiLog;
use Apps\Webiny\Php\Lib\Validators\Password;
use Apps\Webiny\Php\Entities\User;
use MongoDB\Driver\Exception\RuntimeException;
use Webiny\Component\StdLib\StdObject\DateTimeObject\DateTimeObject;

class App extends \Apps\Webiny\Php\Lib\Apps\App
{
    public function bootstrap()
    {
        parent::bootstrap();

        $this->addAppRoute('/^\/welcome/', 'Webiny:Templates/Welcome.tpl');

        $this->addAppRoute('/^\\'.$this->wConfig()->get('Application.Backend').'/', 'Webiny:Templates/Backend.tpl', 380);

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

    public function install()
    {
        parent::install();

        // Create a capped collection for ApiLogs
        $entityCollection = ApiLog::getEntityCollection();
        try {
            $this->wDatabase()->createCollection($entityCollection, [
                'capped' => true,
                'size'   => 2097152,
                'max'    => 2000
            ]);
        } catch (RuntimeException $e) {
            $this->wDatabase()->command([
                'convertToCapped' => $this->wDatabase()->getCollectionPrefix() . $entityCollection,
                'size'            => 2097152,
                'max'             => 2000
            ]);
        }
    }
}