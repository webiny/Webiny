<?php
namespace Webiny\Platform\Builders;

/**
 * @package Builders
 */
trait CliLoggerTrait
{
    protected function _log($msg, $foreground = null, $background = null)
    {
        CliLogger::getInstance()->log($msg, $foreground, $background);
    }
}