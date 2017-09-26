<?php

namespace Apps\Webiny\Php\Lib\I18N\Modifiers;

/**
 * Depending on given number, can return different variations of text, eg. "1 char" or "5 chairs".
 * Class PluralModifier
 * @package Apps\Webiny\Php\Lib\I18N\Modifiers
 */
class PluralModifier extends AbstractModifier
{
    public function getName()
    {
        return 'plural';
    }

    public function execute($value, $parameters = null)
    {
        // Numbers can be single number or ranges.
        for ($i = 0; $i < count($parameters); $i = $i + 2) {
            $current = $parameters[$i];
            if ($current === 'default') {
                return $value . ' ' . $parameters[$i + 1];
            }

            $numbers = explode('|', $current);

            // If we are dealing with a numbers range, then let's check if we are in it.
            if (count($numbers) === 2) {
                if ($value >= $numbers[0] && $value <= $numbers[1]) {
                    return $value . ' ' . $parameters[$i + 1];
                }
                continue;
            }

            if ($value === $numbers[0]) {
                return $value . ' ' . $parameters[$i + 1];
            }

            // If we didn't match any condition, let's just remove the received value.
            return $value;
        }
    }
}