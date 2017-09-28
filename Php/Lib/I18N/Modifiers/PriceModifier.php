<?php

namespace Apps\Webiny\Php\Lib\I18N\Modifiers;

use Apps\Webiny\Php\Lib\I18N\I18N;

/**
 * Formats prices.
 * Class PriceyModifier
 * @package Apps\Webiny\Php\Lib\I18N\Modifiers
 */
class PriceModifier extends AbstractModifier
{
    public function getName()
    {
        return 'price';
    }

    public function execute($value, $parameters = null)
    {
        return I18n::getInstance()->price($value);
    }
}