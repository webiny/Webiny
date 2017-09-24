<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Webiny\Component\Mongo\Index\SingleIndex;

/**
 * Class AppNotification
 *
 * @property string $type
 * @property User   $user
 * @property array  $data
 * @property string $template
 * @property string $subject
 * @property string $text
 */
class AppNotification extends AbstractEntity
{
    protected static $classId = 'Webiny.Entities.AppNotification';
    protected static $collection = 'AppNotifications';

    public function __construct()
    {
        parent::__construct();

        $this->attr('user')->user();
        $this->attr('type')->char();
        $this->attr('data')->object();
        $this->attr('template')->char();
        $this->attr('subject')->char();
        $this->attr('text')->char();
        $this->attr('read')->boolean()->setDefaultValue(false);
    }

    protected static function entityIndexes(IndexContainer $indexes)
    {
        parent::entityIndexes($indexes);

        $indexes->add(new SingleIndex('type', 'type'));
    }
}