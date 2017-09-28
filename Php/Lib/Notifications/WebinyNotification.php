<?php

namespace Apps\Webiny\Php\Lib\Notifications;

use Apps\Webiny\Php\Lib\AppNotifications\AbstractAppNotification;

class WebinyNotification extends AbstractAppNotification
{
    protected static $i18nNamespace = 'Webiny.Remote.Notification';

    private $notification;

    public static function getTypeName()
    {
        return static::wI18n('Webiny Notifications');
    }

    public static function getTypeDescription()
    {
        return static::wI18n('Various notifications published by Webiny team');
    }

    public static function getTypeSlug()
    {
        return 'webiny-notification';
    }

    public static function getTypeRoles()
    {
        return ['webiny-administrator'];
    }

    public function __construct($notification)
    {
        $this->notification = $notification;
    }

    public function getSubject()
    {
        return $this->notification['title'];
    }

    public function getTemplate()
    {
        return $this->notification['text'];
    }

    public function getText()
    {
        return $this->notification['text'];
    }

    public function getCreatedOn()
    {
        return $this->notification['publishedOn'];
    }


    public function getData()
    {
        return ['id' => $this->notification['id'], 'draft' => $this->notification['draft']];
    }
}