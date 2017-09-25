<?php

namespace Apps\Webiny\Php\Lib\I18N\Modifiers;

/**
 * Helps return proper text depending on passed gender (eg. when needing to decide when to use "his" or "her").
 * Class GenderModifier
 * @package Apps\Webiny\Php\Lib\I18N\Modifiers
 */
class GenderModifier extends AbstractModifier
{
    public function getName()
    {
        return 'gender';
    }

    public function execute($value, $parameters)
    {
        return $value === 'male' ? $parameters[0] : $parameters[1];
    }
}