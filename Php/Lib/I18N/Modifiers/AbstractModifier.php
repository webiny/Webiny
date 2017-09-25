<?php

namespace Apps\Webiny\Php\Lib\I18N\Modifiers;

/**
 * Base class for all modifiers.
 * Class AbstractModifier
 * @package Apps\Webiny\Php\Lib\I18N\Modifiers
 */
abstract class AbstractModifier
{
    public abstract function getName();
    public abstract function execute($value, $parameters);
}