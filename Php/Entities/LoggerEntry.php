<?php
namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\DevTools\Api\ApiContainer;
use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;
use Webiny\Component\Mongo\Index\SingleIndex;


/**
 * Class LoggerEntry
 *
 * @property string           $url
 * @property integer          $date
 * @property string           $stack
 * @property string           $clientData
 * @property LoggerErrorGroup $errorGroup
 *
 * @package Apps\Webiny\Php\Entities
 *
 */
class LoggerEntry extends AbstractEntity
{

    protected static $entityCollection = 'LoggerEntry';
    protected static $entityMask = '{id}';

    public function __construct()
    {
        parent::__construct();

        $this->index(new SingleIndex('errorGroup', 'errorGroup'));
        $this->index(new SingleIndex('createdOn', 'createdOn', false, false, false, 5184000)); // expire after 60 days

        $this->attr('url')->char()->setToArrayDefault();
        $this->attr('date')->datetime()->setToArrayDefault();

        $this->attr('stack')->char();
        $this->attr('clientData')->object();

        $this->attr('errorGroup')->many2one()->setEntity('Apps\Webiny\Php\Entities\LoggerErrorGroup');

        $this->api(function(ApiContainer $api) {
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
        });
    }
}