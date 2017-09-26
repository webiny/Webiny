<?php

namespace Apps\Webiny\Php\Lib\I18N\Modifiers;

use Apps\Webiny\Php\Lib\I18N\I18N;

/**
 * Formats number.
 * Class NumberModifier
 * @package Apps\Webiny\Php\Lib\I18N\Modifiers
 */
class NumberModifier extends AbstractModifier
{
    public function getName()
    {
        return 'number';
    }

    public function execute($value, $parameters = null)
    {
        return I18n::getInstance()->number($value);
    }
}