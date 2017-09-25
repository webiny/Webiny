<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Exceptions\AppException;

/**
 * Class I18NTextGroup
 *
 * @property string $name
 * @property string $description
 * @property string $app
 * @property int    $totalTexts
 */
class I18NTextGroup extends AbstractEntity
{
    protected static $collection = 'I18NTextGroups';
    protected static $i18nNamespace = 'Webiny.Entities.I18NTextGroup';
    protected static $classId = 'Webiny.Entities.I18NTextGroup';

    public function __construct()
    {
        parent::__construct();

        $this->attr('app')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('name')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('description')->char()->setToArrayDefault();

        $this->attr('totalTexts')->dynamic(function () {
            return I18NText::count(['group' => $this->id]);
        });

    }

    /**
     * Group cannot be deleted if there are texts already in it.
     * @throws AppException
     */
    public function canDelete()
    {
        if ($this->totalTexts > 0) {
            throw new AppException($this->wI18n("Cannot delete text group because it's in use by existing texts."));
        }
        parent::canDelete();
    }

}