<?php

namespace Apps\Webiny\Php\Entities;

/**
 * Class Settings
 */
class Settings extends AbstractSettings
{
    protected static $classId = 'Webiny.Entities.Settings';
    protected static $isDiscoverable = false;
    protected static $key = 'webiny';

    public function getUpdateInProgress()
    {
        return $this->settings->key('updateInProgress');
    }


    public function setUpdateInProgress($flag)
    {
        $this->settings->key('updateInProgress', $flag);

        return $this;
    }

    /**
     * Get timestamp of last marketplace app versions check
     *
     * @return int|null
     */
    public function getLastVersionCheck()
    {
        return $this->settings->keyNested('marketplace.lastVersionCheck', 0, true);
    }

    /**
     * Set timestamp of last marketplace app versions check
     *
     * @param int $timestamp
     *
     * @return $this
     */
    public function setLastVersionsCheck($timestamp)
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
        return $this->settings->keyNested('webiny.lastNotificationsCheck', 0, true);
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

    /**
     * Get last checked app versions
     *
     * @return array
     */
    public function getNotifiedVersions()
    {
        return $this->settings->keyNested('marketplace.notifiedVersions', [], true);
    }

    /**
     * Set last checked app versions
     *
     * @param array $versions
     *
     * @return $this
     */
    public function setNotifiedVersions($versions)
    {
        $this->settings->keyNested('marketplace.notifiedVersions', $versions);

        return $this;
    }
}