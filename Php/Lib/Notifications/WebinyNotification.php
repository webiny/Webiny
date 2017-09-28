<?php

namespace Apps\Webiny\Php\Lib;

use Apps\Webiny\Php\Lib\AppNotifications\AbstractAppNotification;

class WebinyNotification extends AbstractAppNotification
{
    const TITLE = 'Webiny Notifications';
    const DESCRIPTION = 'Various notifications published by Webiny team';
    const SLUG = 'webiny-notification';
    const ROLES = ['webiny-administrator'];

    private $subject = '';

    public function setSubject($subject)
    {
        $this->subject = $subject;

        return $this;
    }

    public function getSubject()
    {
        return $this->subject;
    }

    public function getTemplate()
    {
        return $this->getText();
    }

    public function getData()
    {
        return ['id' => $this->job->id, 'name' => $this->job->name];
    }
}