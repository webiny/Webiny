<?php

namespace Apps\Webiny\Php\Lib\I18N\Modifiers;

use Apps\Webiny\Php\Lib\I18N\I18N;

/**
 * Formats money.
 * Class MoneyModifier
 * @package Apps\Webiny\Php\Lib\I18N\Modifiers
 */
class MoneyModifier extends AbstractModifier
{
    public function getName()
    {
        return 'money';
    }

    public function execute($value, $parameters = null)
    {
        return I18n::getInstance()->money($value);
    }
}