<?php
namespace Webiny\Platform\Builders;

/**
 * @package Builders
 */
trait CliLoggerTrait
{
    protected function _log($msg)
    {
        if (php_sapi_name() == 'cli') {
            echo $msg . "\n";
        }
    }
}