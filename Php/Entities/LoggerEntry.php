<?php
namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Webiny\Component\Mongo\Index\SingleIndex;


/**
 * Class LoggerEntry
 *
 * @property string           $url
 * @property integer          $date
 * @property string           $stack
 * @property string           $clientData
 * @property LoggerErrorGroup $errorGroup
 */
class LoggerEntry extends AbstractEntity
{
    protected static $classId = 'Webiny.Entities.LoggerEntry';
    protected static $entityCollection = 'LoggerEntry';

    public function __construct()
    {
        parent::__construct();

        $this->attr('url')->char()->setToArrayDefault();
        $this->attr('date')->datetime()->setToArrayDefault();
        $this->attr('stack')->char();
        $this->attr('clientData')->object();
        $this->attr('errorGroup')->many2one()->setEntity(LoggerErrorGroup::class);
    }

    protected function entityApi(ApiContainer $api)
    {
        parent::entityApi($api);

        /**
         * @api.name        Resolve logger entry
         * @api.description Resolves given logger entry.
         */
        $api->post('{id}/resolve', function () {
            // re-calculate the number of errors inside the same group
            $this->errorGroup->errorCount--;

            if ($this->errorGroup->errorCount < 1) {
                $this->errorGroup->delete();
            }else{
                $this->errorGroup->save();
                $this->delete();
            }

            return [
                'errorCount' => $this->errorGroup->errorCount,
                'errorGroup' => $this->errorGroup->id,
            ];
        });
    }


    protected static function entityIndexes(IndexContainer $indexes)
    {
        parent::entityIndexes($indexes);

        $indexes->add(new SingleIndex('errorGroup', 'errorGroup'));
        $indexes->add(new SingleIndex('createdOn', 'createdOn', false, false, false, 5184000)); // expire after 60 days
    }
}