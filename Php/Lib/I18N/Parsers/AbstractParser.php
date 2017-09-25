<?php

namespace Apps\Webiny\Php\Lib\I18N\Parsers;

use Apps\Webiny\Php\Lib\Apps\App;

/**
 * Base class for all parsers.
 * Class AbstractParser
 * @package Apps\Webiny\Php\Lib\I18N\Parsers
 */
abstract class AbstractParser
{
    const NAMESPACE_ALLOWED_CHARS = 'A-Za-z\.0-9';
    public abstract function parse(App $app);
}