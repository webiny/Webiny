<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class LoggerErrorGroup
 *
 * @property string           $error
 * @property string           $errorHash
 * @property string           $type
 * @property EntityCollection $errorEntries
 *
 * @package Apps\Core\Php\Entities
 *
 */
class LoggerErrorGroup extends EntityAbstract
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

        /*
         * Api or Js
         */
        $this->attr('type')->char()->setToArrayDefault();

        $this->attr('errorEntries')->one2many('id')->setEntity('\Apps\Core\Php\Entities\LoggerEntry');


        $this->api('POST', '/save-report', function () {
            $errors = $this->wRequest()->payload('errors');
            $this->saveReport($errors);
        });
    }


    public function saveReport($errors)
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
            $errorEntry->save();

            // assign the error under the group
            $group->errorEntries->add($errorEntry);
            $group->save();
        }
    }
}