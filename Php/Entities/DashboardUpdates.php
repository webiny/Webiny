<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Webiny\Component\Mongo\Index\CompoundIndex;
use Webiny\Component\Mongo\Index\SingleIndex;

/**
 * Class Updates controls the updates that will be delivered to Webiny Dashboard
 *
 * @property boolean $dismissed
 */
class DashboardUpdates extends AbstractEntity
{
    protected static $classId = 'Webiny.Entities.DashboardUpdates';
    protected static $collection = 'DashboardUpdates';

    public function __construct()
    {
        parent::__construct();

        $this->attr('refId')->char()->setToArrayDefault(true);
        $this->attr('userId')->char()->setToArrayDefault(true);
        $this->attr('title')->char()->setToArrayDefault(true);
        $this->attr('content')->char()->setToArrayDefault(true);
        $this->attr('hasLink')->boolean()->setDefaultValue(false)->setToArrayDefault(true);
        $this->attr('dismissed')->boolean()->setDefaultValue(false); // this will contain the id of user which dismissed the update
        $this->attr('order')->integer()->setDefaultValue(0);
        $this->attr('image')->char()->setToArrayDefault(true);
    }

    protected function entityApi(ApiContainer $api)
    {
        parent::entityApi($api);

        /**
         * @api.name        Get the latest dashboard updates
         * @api.description Retrieves the latest dashboard updates for the current user.
         */
        $api->get('latest', function () {
            // first we populate the updates for that user
            $user = $this->wAuth()->getUser();
            if (!$user) {
                return false;
            }
            $this->populateUpdates($user);

            // once populated, filter and display the results
            $result = self::find(['dismissed' => false, 'userId' => $user->id], ['-order'], 10);

            return $this->apiFormatList($result, '*');
        });

        $api->get('{dashboardUpdate}/dismiss', function (DashboardUpdates $dashboardUpdate) {
            $dashboardUpdate->dismissed = true;
            $dashboardUpdate->save();
        });
    }


    protected static function entityIndexes(IndexContainer $indexes)
    {
        parent::entityIndexes($indexes);

        $indexes->add(new CompoundIndex('refIdUserId', ['refId', 'userId']));
        $indexes->add(new SingleIndex('dismissed', 'dismissed'));
        $indexes->add(new SingleIndex('order', 'order'));
    }


    // @todo: make this more bullet proof so in case of problems we fail gracefully
    private function populateUpdates(User $user)
    {
        // request the latest updates from webiny hub
        // suppress errors and set timeout to 3s
        $context = stream_context_create(['http' => ['timeout' => 3]]);
        $updates = @file_get_contents('https://api.webiny.com/entities/the-hub/updates/latest', false, $context);
        if (!$updates) {
            return;
        }

        $updates = self::jsonDecode($updates, true);
        if (!$updates) {
            return;
        }

        // loop through the updates and insert the ones for this user that don't exist in the current collection
        if (!is_array($updates['data']) || !isset($updates['data']['list']) || count($updates['data']['list']) < 1) {
            return;
        }

        foreach ($updates['data']['list'] as $u) {
            $update = self::findOne(['refId' => $u['id'], 'userId' => $user->id]);

            // create new update for this user if it doesn't exist, otherwise, just update the existing update
            if (!$update) {
                $update = new self;
            }

            $update->refId = $u['id'];
            $update->title = $u['title'];
            $update->content = $u['content'];
            $update->order = $u['order'];
            if (isset($u['image']['src'])) {
                $update->image = $u['image']['src'];
            }
            $update->hasLink = $u['hasLink'];
            $update->userId = $user->id;
            $update->save();
        }

        return;
    }
}