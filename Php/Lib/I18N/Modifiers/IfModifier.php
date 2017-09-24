<?php

namespace Apps\Webiny\Php\Lib\I18N;

use Apps\Webiny\Php\Lib\I18N\Modifiers\AbstractModifier;

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