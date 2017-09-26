<?php

namespace Apps\Webiny\Php\Lib\I18N\Modifiers;

use Apps\Webiny\Php\Lib\I18N\I18N;

/**
 * Formats datetime.
 * Class DateTimeModifier
 * @package Apps\Webiny\Php\Lib\I18N\Modifiers
 */
class DateTimeModifier extends AbstractModifier
{
    public function getName()
    {
        return 'datetime';
    }

    public function execute($value, $parameters = null)
    {
        return I18n::getInstance()->datetime($value);
    }
}