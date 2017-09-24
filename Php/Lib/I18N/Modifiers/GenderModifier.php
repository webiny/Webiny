<?php

namespace Apps\Webiny\Php\Lib\I18N\Modifiers;

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