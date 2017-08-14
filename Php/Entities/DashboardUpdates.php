<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;
use Apps\Webiny\Php\DevTools\WebinyTrait;
use Webiny\Component\Mongo\Index\CompoundIndex;
use Webiny\Component\Mongo\Index\SingleIndex;

/**
 * Class Updates controls the updates that will be delivered to Webiny Dashboard
 *
 * @package Apps\Webiny\Php\Entities
 *
 */
class DashboardUpdates extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'DashboardUpdates';

    public function __construct()
    {
        parent::__construct();

        $this->index(new CompoundIndex('refIdUserId', ['refId', 'userId']));
        $this->index(new SingleIndex('dismissed', 'dismissed'));
        $this->index(new SingleIndex('order', 'order'));

        $this->attr('refId')->char()->setToArrayDefault(true);
        $this->attr('userId')->char()->setToArrayDefault(true);
        $this->attr('title')->char()->setToArrayDefault(true);
        $this->attr('content')->char()->setToArrayDefault(true);
        $this->attr('hasLink')->boolean()->setDefaultValue(false)->setToArrayDefault(true);
        $this->attr('dismissed')->object()->setDefaultValue(false); // this will contain the id of user which dismissed the update
        $this->attr('order')->integer()->setDefaultValue(0);
        $this->attr('image')->char()->setToArrayDefault(true);


        /**
         * @api.name        Get the latest dashboard updates
         * @api.description Retrieves the latest dashboard updates for the current user.
         */
        $this->api('GET', 'latest', function () {
            // first we populate the updates for that user
            $user = $this->wAuth()->getUser();
            if (!$user) {
                return $this->apiFormatList([], '*');
            }
            $this->populateUpdates($user);

            // once populated, filter and display the results
            $result = self::find(['dismissed' => false], ['-order'], 10);

            return $this->apiFormatList($result, '*');
        });

        // @todo: every admin user needs to have this access
        // @todo: dismiss
        $this->api('GET', '{id}/dismiss', function () {

        });
    }

    // @todo: make this more bullet proof so in case of problems we fail gracefully
    private function populateUpdates(User $user)
    {
        // request the latest updates from webiny hub
        $updates = file_get_contents('http://demo.app/api/entities/the-hub/updates/latest');
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
            if (!self::findOne(['refId' => $u['id'], 'userId' => $user->id])) {
                // create new update for this user
                $update = new self;
                $update->refId = $u['id'];
                $update->title = $u['title'];
                $update->content = $u['content'];
                $update->order = $u['order'];
                if(isset($u['image']['src'])){
                    $update->image = $u['image']['src'];
                }
                if(empty($u['hasLink'])){
                    $update->hasLink = $u['hasLink'];
                }
                $update->userId = $user->id;
                $update->save();
            }
        }

        return;
    }
}