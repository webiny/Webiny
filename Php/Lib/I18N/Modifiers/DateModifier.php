<?php

namespace Apps\Webiny\Php\Lib\I18N\Modifiers;

use Apps\Webiny\Php\Lib\I18N\I18N;

/**
 * Formats date.
 * Class DateModifier
 * @package Apps\Webiny\Php\Lib\I18N\Modifiers
 */
class DateModifier extends AbstractModifier
{
    public function getName()
    {
        return 'date';
    }

    public function execute($value, $parameters = null)
    {
        return I18n::getInstance()->date($value);
    }
}