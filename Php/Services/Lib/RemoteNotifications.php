<?php

namespace Apps\Webiny\Php\Services\Lib;

use Apps\Webiny\Php\Entities\Settings;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\Notifications\MarketplaceNotification;
use Apps\Webiny\Php\Lib\Notifications\WebinyNotification;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Composer\Semver\Comparator;
use Webiny\Component\StdLib\StdLibTrait;

class RemoteNotifications
{
    use WebinyTrait, StdLibTrait;

    private $notificationsApi;
    private $marketplaceApi;
    private $settings;
    private $now;
    private $checkNotifications = false;
    private $checkVersions = false;

    public function __construct()
    {
        // Verify config parameters
        $this->notificationsApi = $this->wConfig()->get('Webiny.Notifications.Api');
        if (!$this->notificationsApi) {
            throw new AppException('Webiny.Notifications.Api config is not present!');
        }

        $this->marketplaceApi = $this->wConfig()->get('Webiny.Marketplace.Api');
        if (!$this->marketplaceApi) {
            throw new AppException('Webiny.Marketplace.Api config is not present!');
        }

        $this->now = time();
        $this->settings = Settings::load(true);

        $lastNotificationsCheck = $this->settings->getLastNotificationsCheck();
        $interval = $this->wConfig()->get('Webiny.Notifications.Intervals.WebinyNotifications', 60) * 60;

        if (!$lastNotificationsCheck || ($lastNotificationsCheck + $interval) < $this->now) {
            $this->checkNotifications = true;
        }

        $lastVersionsCheck = $this->settings->getLastVersionCheck();
        $interval = $this->wConfig()->get('Webiny.Notifications.Intervals.MarketplaceAppVersions', 60) * 60;
        if (!$lastVersionsCheck || ($lastVersionsCheck + $interval) < $this->now) {
            $this->checkVersions = true;
        }
    }

    public function fetch()
    {
        if ($this->settings->getUpdateInProgress() || !($this->checkNotifications || $this->checkVersions)) {
            return;
        }

        $this->settings->setUpdateInProgress(true)->save();

        $curl = new \Curl\Curl();

        // Fetch notifications
        try {
            if ($this->checkNotifications) {
                $curl->get($this->notificationsApi . '/entities/the-hub/notifications/latest/' . $this->settings->getLastNotificationsCheck());
                if (!$curl->error) {
                    $data = json_decode($curl->rawResponse, true);
                    $list = $data['data']['list'] ?? null;
                    if (is_array($list)) {
                        foreach ($list as $notification) {
                            $wn = new WebinyNotification($notification);
                            $this->wAppNotifications()->publish($wn);
                        }
                        // Only update last check time if we actually received a valid response
                        $this->settings->setLastNotificationsCheck($this->now)->save();
                    }
                }
            }

            // Get latest app versions if necessary
            if ($this->checkVersions) {
                $curl->get($this->marketplaceApi . '/services/marketplace-manager/marketplace/versions');
                if (!$curl->error) {
                    $data = json_decode($curl->rawResponse, true);
                    $list = $data['data']['list'] ?? null;
                    if (is_array($list)) {
                        $updates = [];
                        $installedApps = $this->wApps()->getInstalledApps();
                        $notifiedVersions = $this->settings->getNotifiedVersions();

                        foreach ($list as $latestApp) {
                            $installedApp = $installedApps[$latestApp['localName']] ?? null;
                            if (!$installedApp) {
                                continue;
                            }

                            $notifiedVersion = $notifiedVersions[$installedApp['Name']] ?? $installedApp['Version'];
                            if (Comparator::greaterThan($latestApp['version'], $notifiedVersion)) {
                                $updates[] = $latestApp;
                            }

                            // Store latest version
                            $notifiedVersions[$latestApp['localName']] = $latestApp['version'];
                        }

                        $this->settings->setNotifiedVersions($notifiedVersions)->save();

                        if (!empty($updates)) {
                            if (count($updates) === 1) {
                                $template = 'New version available for {app} ({version})!';
                                $data = ['app' => $updates[0]['localName'], 'version' => $updates[0]['version']];
                            } else {
                                $template = 'New versions available for {count} apps!';
                                $data = ['count' => count($updates)];
                            }

                            $n = new MarketplaceNotification($template);
                            $n->setData($data);
                            $this->wAppNotifications()->publish($n);
                        }

                        // Only update last check time if we actually received a valid response
                        $this->settings->setLastVersionsCheck($this->now)->save();
                    }
                }
            }
        } catch (\Exception $e) {
            // Ignore errors for now, we will update this later
        } finally {
            $this->settings->setUpdateInProgress(false)->save();
        }
    }
}