<?php

namespace Apps\Webiny\Php\Entities;

/**
 * Class Settings
 *
 * This class serves for demo purposes in Docs sandboxes
 */
class Settings extends AbstractSettings
{
    protected static $classId = 'Webiny.Entities.Settings';
    protected static $isDiscoverable = false;
    protected static $key = 'webiny';

    /**
     * Get timestamp of last marketplace app versions check
     *
     * @return int|null
     */
    public function getLastVersionCheck()
    {
        return $this->settings->keyNested('marketplace.lastVersionCheck');
    }

    /**
     * Set timestamp of last marketplace app versions check
     *
     * @param int $timestamp
     *
     * @return $this
     */
    public function setLastVersionCheck($timestamp)
    {
        $this->settings->keyNested('marketplace.lastVersionCheck', $timestamp);

        return $this;
    }

    /**
     * Get timestamp of last notifications check
     *
     * @return int|null
     */
    public function getLastNotificationsCheck()
    {
        return $this->settings->keyNested('marketplace.lastVersionCheck');
    }

    /**
     * Set timestamp of last notifications check
     *
     * @param $timestamp
     *
     * @return $this
     */
    public function setLastNotificationsCheck($timestamp)
    {
        $this->settings->keyNested('webiny.lastNotificationsCheck', $timestamp);

        return $this;
    }
}