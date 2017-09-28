<?php

namespace Apps\Webiny\Php\Services;

use Apps\Webiny\Php\Entities\AppNotification;
use Apps\Webiny\Php\Entities\Settings;
use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\AppNotifications\AbstractAppNotification;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\Response\ListResponse;
use Apps\Webiny\Php\Lib\Services\AbstractService;
use Apps\Webiny\Php\Lib\WebinyNotification;
use Webiny\Component\Entity\EntityCollection;

/**
 * Class AppNotifications
 */
class AppNotifications extends AbstractService
{
    protected static $classId = 'Webiny.Services.AppNotifications';

    protected function serviceApi(ApiContainer $api)
    {
        /**
         * @api.name Get notifications
         * @api.description Returns notifications for current user
         */
        $api->get('/', function () {
            $user = $this->wAuth()->getUser();
            $page = $this->wRequest()->getPage();
            $perPage = $this->wRequest()->getPerPage();

            $fields = $this->wRequest()->getFields('id,createdOn,type,read,subject,text,template,data');

            // If user is not subscribed to any notifications - return empty list
            if (!is_array($user->meta['appNotifications'])) {
                return new ListResponse([
                    'meta' => [
                        'totalCount'  => 0,
                        'totalPages'  => 0,
                        'perPage'     => $perPage,
                        'currentPage' => $page,
                        'fields'      => $fields
                    ],
                    'list' => []
                ]);
            }

            // Get remote notifications
            $this->getRemoteNotifications();

            // Filter types to only the ones user is subscribed to and is allowed to see
            $types = $this->arr($this->wAppNotifications()->getTypes())->filter(function ($type) use ($user) {
                return in_array($type::SLUG, $user->meta['appNotifications']) && $user->hasRole($type::ROLES);
            })->map(function ($type) {
                return $type::SLUG;
            })->values()->val();

            $query = ['type' => $types];
            $notifications = AppNotification::find($query, ['-createdOn'], $perPage, $page);

            $listResponse = $this->apiFormatList($notifications, $fields);
            $responseData = $listResponse->getData();

            // Add unread notifications count
            $query['read'] = false;
            $responseData['meta']['unread'] = AppNotification::count($query);
            $listResponse->setData($responseData);

            return $listResponse;
        });

        /**
         * @api.name Get notification types
         * @api.description Returns array of notification types
         */
        $api->get('types', function () {
            $user = $this->wAuth()->getUser();
            $types = [];

            /* @var $class AbstractAppNotification */
            foreach ($this->wAppNotifications()->getTypes() as $class) {
                if ($user->hasRole($class::ROLES)) {
                    $types[] = [
                        'title'       => $class::TITLE,
                        'description' => $class::DESCRIPTION,
                        'type'        => $class::SLUG
                    ];
                }
            }

            return $types;
        });

        /**
         * @api.name Mark notification as read
         * @api.description Mark notification as read
         */
        $api->post('{notification}/mark-read', function (AppNotification $notification) {
            $notification->read = true;
            $notification->save();

            return true;
        });

        /**
         * @api.name Mark all notifications as read
         * @api.description Mark all notifications as read
         */
        $api->post('mark-read', function () {
            $user = $this->wAuth()->getUser();

            AppNotification::find(['read' => false, 'user' => $user->id])->map(function (AppNotification $n) {
                $n->read = true;
                $n->save();
            });

            return true;
        });
    }

    private function getRemoteNotifications()
    {
        $settings = Settings::load(true);
        // Get Webiny notifications if necessary
        $lastNotificationsCheck = $settings->getLastNotificationsCheck();
        $interval = $this->wConfig()->get('Webiny.Notifications.Intervals.WebinyNotifications', 60) * 60;
        if (!$lastNotificationsCheck || ($lastNotificationsCheck + $interval) < time()) {
            $notificationsApi = $this->wConfig()->get('Webiny.Notifications.Api');
            if (!$notificationsApi) {
                throw new AppException('Webiny.Notifications.Api config is not present!');
            }

            $curl = new \Curl\Curl();
            $curl->get($notificationsApi . '/entities/the-hub/notifications/latest/' . $lastNotificationsCheck);
            if (!$curl->error) {
                $data = json_decode($curl->rawResponse, true);
                if (is_array($data) && $data['list']) {
                    foreach($data['list'] as $notification) {
                        $wn = new WebinyNotification();
                    }
                }
            }
        }

        // Get latest app versions if necessary
    }
}