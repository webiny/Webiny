<?php

namespace Apps\Webiny\Php\Lib\AppNotifications;

use Apps\Webiny\Php\Entities\User;

/**
 * Class used to create app notification classes
 */
abstract class AbstractAppNotification
{
    /**
     * @var User
     */
    protected $user;

    public function setUser()
    {

    }
}