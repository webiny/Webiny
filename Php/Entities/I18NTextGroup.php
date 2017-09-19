<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\WebinyTrait;

/**
 * Class I18NTextGroup
 *
 * @property string      $name
 */
class I18NTextGroup extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'I18NTextGroups';
    protected static $i18nNamespace = 'Webiny.Entities.I18NTextGroup';

    public function __construct()
    {
        parent::__construct();

        $this->attr('name')->char()->setValidators('required')->setToArrayDefault()->setOnce();
    }
}