<?php

namespace Apps\Webiny\Php\Lib\Notifications;

use Apps\Webiny\Php\Lib\AppNotifications\AbstractAppNotification;

class MarketplaceNotification extends AbstractAppNotification
{
    protected static $i18nNamespace = 'Webiny.Marketplace.Notification';

    private $template;

    public static function getTypeName()
    {
        return static::wI18n('Marketplace Notifications');
    }

    public static function getTypeDescription()
    {
        return static::wI18n('Notification regarding new app versions');
    }

    public static function getTypeSlug()
    {
        return 'webiny-marketplace-notification';
    }

    public static function getTypeRoles()
    {
        return ['webiny-marketplace'];
    }

    public function __construct($template)
    {
        $this->template = $template;
    }

    public function getSubject()
    {
        return $this->wI18n('Marketplace update');
    }

    public function getTemplate()
    {
        return $this->template;
    }
}