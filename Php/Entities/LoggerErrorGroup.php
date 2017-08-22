<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\DevTools\Api\ApiContainer;
use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;
use Webiny\Component\Entity\EntityCollection;

/**
 * Class LoggerErrorGroup
 *
 * @property string           $error
 * @property string           $errorHash
 * @property string           $type
 * @property date             $lastEntry
 * @property integer          $errorCount
 * @property EntityCollection $errorEntries
 *
 * @package Apps\Webiny\Php\Entities
 *
 */
class LoggerErrorGroup extends AbstractEntity
{

    protected static $entityCollection = 'LoggerErrorGroup';
    protected static $entityMask = '{error}';

    public function __construct()
    {
        parent::__construct();
        /*
         * Api url or error message
         */
        $this->attr('error')->char()->setToArrayDefault();
        $this->attr('errorHash')->char();

        $this->attr('type')->char()->setToArrayDefault()->setValidators('in:api:js:php');

        $this->attr('errorEntries')->one2many('errorGroup')->setEntity('\Apps\Webiny\Php\Entities\LoggerEntry');

        $this->attr('lastEntry')->datetime()->setToArrayDefault();
        $this->attr('errorCount')->integer()->setToArrayDefault()->setDefaultValue(0);
    }


    public function saveReport($errors, $clientData)
    {
        $groups = [];

        foreach ($errors as $e) {
            // get error group
            $errorHash = md5($e['msg']);
            if (!isset($groups[$errorHash])) {
                $group = LoggerErrorGroup::findOne(['errorHash' => $errorHash, 'type' => $e['type']]);

                if (!$group) {
                    // save new group
                    $group = new LoggerErrorGroup();
                    $group->error = $e['msg'];
                    $group->errorHash = $errorHash;
                    $group->type = $e['type'];
                    $group->save();
                    $groups[$group->errorHash] = $group->id;
                } else {
                    $groups[$group->errorHash] = $group->id;
                }
            } else {
                $group = LoggerErrorGroup::findById($groups[$errorHash]);
            }

            // save error
            $errorEntry = new LoggerEntry();
            $errorEntry->date = $e['date'];
            $errorEntry->stack = $e['stack'];
            $errorEntry->url = $e['url'];
            $errorEntry->clientData = $clientData;
            $errorEntry->save();

            // assign the error under the group
            $group->errorEntries[] = $errorEntry;
            $group->lastEntry = time();
            $group->errorCount = $group->errorCount + 1;
            $group->save();
        }
    }

    public function getStats()
    {
        // errors today
        // errors in the last 7 days
        // total errors
    }

    protected function entityApi(ApiContainer $api)
    {
        parent::entityApi($api);

        /**
         * @api.name        Save report
         * @api.description Saves an error report.
         */
        $api->post('/save-report', function () {
            $clientData = $this->wRequest()->payload('client');
            $errors = $this->wRequest()->payload('errors');
            $this->saveReport($errors, $clientData);
        })->setPublic();
    }
}