<?php
namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;


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

        $this->attr('url')->char()->setToArrayDefault();
        $this->attr('date')->datetime()->setToArrayDefault();

        $this->attr('stack')->char();
        $this->attr('clientData')->object();

        $this->attr('errorGroup')->many2one()->setEntity('Apps\Webiny\Php\Entities\LoggerErrorGroup');

        $this->api('POST', '{id}/resolve', function () {
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
}