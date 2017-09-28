<?php

namespace Apps\Webiny\Php\Lib;

use Apps\Webiny\Php\Lib\AppNotifications\AbstractAppNotification;

class MarketplaceNotification extends AbstractAppNotification
{
    const TITLE = 'Marketplace Notifications';
    const DESCRIPTION = 'Notifications regarding new app versions';
    const SLUG = 'webiny-notification';
    const ROLES = ['webiny-marketplace'];

    public function getSubject()
    {
        return 'Cron Job';
    }

    public function getTemplate()
    {
        return 'Cron job {name} finished successfully!';
    }

    public function getText()
    {
        $text = $this->str($this->getTemplate());
        $text->replace('{name}', $this->job->name);

        return $text->val();
    }

    public function getData()
    {
        return ['id' => $this->job->id, 'name' => $this->job->name];
    }

    public function setJob(Job $job)
    {
        $this->job = $job;

        return $this;
    }
}