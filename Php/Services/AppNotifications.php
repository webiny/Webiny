<?php

namespace Apps\Webiny\Php\Services;

use Apps\Webiny\Php\Entities\AppNotification;
use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\AppNotifications\AbstractAppNotification;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\Response\ListResponse;
use Apps\Webiny\Php\Lib\Services\AbstractService;
use Apps\Webiny\Php\Services\Lib\RemoteNotifications;

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
            $remote = new RemoteNotifications();
            $remote->fetch();

            // Filter types to only the ones user is subscribed to and is allowed to see
            $types = $this->arr($this->wAppNotifications()->getTypes())->filter(function ($type) use ($user) {
                return in_array($type::getTypeSlug(), $user->meta['appNotifications']) && $user->hasRole($type::getTypeRoles());
            })->map(function ($type) {
                return $type::getTypeSlug();
            })->values()->val();

            $query = ['type' => $types, 'user' => $user->id];
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
                if ($user->hasRole($class::getTypeRoles())) {
                    $types[] = [
                        'title'       => $class::getTypeName(),
                        'description' => $class::getTypeDescription(),
                        'type'        => $class::getTypeSlug()
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
            $user = $this->wAuth()->getUser();
            if ($notification->createdBy->id !== $user->id) {
                throw new AppException('You are only allowed to modify notifications that belong to you.', 'WBY-APP-NOTIFICATION');
            }
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
}