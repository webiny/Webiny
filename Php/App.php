<?php

namespace Apps\Webiny\Php;

use Apps\Webiny\Php\Entities\ApiLog;
use Apps\Webiny\Php\Entities\SystemApiTokenUser;
use Apps\Webiny\Php\Lib\Entity\Validators\Unique;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\Notifications\MarketplaceNotification;
use Apps\Webiny\Php\Lib\Notifications\WebinyNotification;
use Apps\Webiny\Php\Lib\Validators\Password;
use Apps\Webiny\Php\Entities\User;
use MongoDB\Driver\Exception\RuntimeException;
use Webiny\Component\Entity\Entity;
use Webiny\Component\StdLib\StdObject\DateTimeObject\DateTimeObject;

class App extends \Apps\Webiny\Php\Lib\Apps\App
{
    public function bootstrap()
    {
        parent::bootstrap();

        $this->addAppRoute('/^\/$/', 'Webiny:Templates/Welcome.tpl', 400);
        $this->addAppRoute('/^\\' . $this->wConfig()->get('Webiny.Backend.Path') . '/', 'Webiny:Templates/Backend.tpl', 450);

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

        // Override default entity `unique` validator to include `deletedOn` attribute
        Entity::getInstance()->addValidator(new Unique());
    }

    public function install()
    {
        parent::install();

        // Create SystemApiTokenUser
        try {
            $systemUser = new SystemApiTokenUser();
            $systemUser->save();
        } catch (AppException $e) {
            // Means user already exists
        }


        // Create a capped collection for ApiLogs
        $entityCollection = ApiLog::getCollection();
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

    public function getAppNotificationTypes()
    {
        return [
            WebinyNotification::class,
            MarketplaceNotification::class
        ];
    }
}