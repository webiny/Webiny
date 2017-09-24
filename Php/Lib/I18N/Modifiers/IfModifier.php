<?php

namespace Apps\Webiny\Php\Lib\I18N\Modifiers;

class IfModifier extends AbstractModifier
{
    public function getName()
    {
        return 'if';
    }

    public function execute($value, $parameters)
    {
        return $value === $parameters[0] ? $parameters[1] : $parameters[2] || '';
    }
}