<?php

namespace Apps\Webiny\Php\Lib\AppNotifications;

use Apps\Webiny\Php\Entities\AppNotification;
use Apps\Webiny\Php\Entities\User;
use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\StdLib\SingletonTrait;


/**
 * Class used to publish in-app notifications
 */
class AppNotifications
{
    use WebinyTrait, SingletonTrait;

    public function publish(AbstractAppNotification $notification)
    {
        $data = [
            'type'     => $notification::SLUG,
            'data'     => $notification->getData(),
            'template' => $notification->getTemplate(),
            'subject'  => $notification->getSubject(),
            'text'     => $notification->getText()
        ];

        $users = [];
        // If specific user is set, he is the only one who should receive this notification
        $singleUser = $notification->getUser();
        if ($singleUser) {
            $users[] = $singleUser;
        } else {
            // Find user IDs that should receive this notification
            $users = User::find(['meta.appNotifications' => $data['type']])->filter(function (User $user) use ($notification) {
                return $user->hasRole($notification::ROLES);
            });
        }

        foreach ($users as $u) {
            $an = new AppNotification();
            $an->populate($data);
            $an->user = $u->id;
            $an->save();
        }
    }

    /**
     * Get array of app notification types (classes)
     *
     * @return string[]
     * @throws AppException
     */
    public function getTypes()
    {
        $classes = [];
        $const = ['TITLE', 'DESCRIPTION', 'SLUG', 'ROLES'];
        /* @var $app App */
        foreach ($this->wApps() as $app) {
            foreach ($app->getAppNotificationTypes() as $class) {
                // Validate class constants
                foreach ($const as $c) {
                    if (!@constant($class . '::' . $c)) {
                        throw new AppException($class . ' must define a ' . $c . ' constant', 'WBY-INVALID-APP-NOTIFICATION-CLASS');
                    }
                }
                $classes[] = $class;
            }
        }

        return $classes;
    }

    /**
     * Get notification type (class) by name
     *
     * @param string $type
     *
     * @return null
     */
    public function getType($type)
    {
        foreach ($this->wApps() as $app) {
            foreach ($app->getAppNotificationTypes() as $class) {
                if ($class::SLUG === $type) {
                    return $class;
                }
            }
        }

        return null;
    }
}