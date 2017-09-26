<?php

namespace Apps\Webiny\Php\Lib\I18N\Modifiers;

use Apps\Webiny\Php\Lib\I18N\I18N;

/**
 * Formats time.
 * Class TimeModifier
 * @package Apps\Webiny\Php\Lib\I18N\Modifiers
 */
class TimeModifier extends AbstractModifier
{
    public function getName()
    {
        return 'time';
    }

    public function execute($value, $parameters = null)
    {
        return I18n::getInstance()->time($value);
    }
}