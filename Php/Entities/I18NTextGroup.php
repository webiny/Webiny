<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\WebinyTrait;

/**
 * Class I18NTextGroup
 *
 * @property string $name
 * @property int    $totalTexts
 */
class I18NTextGroup extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'I18NTextGroups';
    protected static $i18nNamespace = 'Webiny.Entities.I18NTextGroup';
    protected static $classId = 'Webiny.Entities.I18NTextGroup';

    public function __construct()
    {
        parent::__construct();

        $this->attr('name')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('totalTexts')->dynamic(function () {
            return I18NText::count(['group' => $this->id]);
        });
        $this->attr('description')->char()->setToArrayDefault();

    }

    public function canDelete()
    {
        if ($this->totalTexts > 0) {
            throw new AppException($this->wI18n("Cannot delete text group because it's in use by existing texts."));
        }
        parent::canDelete();
    }

}