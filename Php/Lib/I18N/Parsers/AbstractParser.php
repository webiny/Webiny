<?php

namespace Apps\Webiny\Php\Lib\I18N\Parsers;

use Apps\Webiny\Php\Lib\Apps\App;

abstract class AbstractParser
{
    const NAMESPACE_ALLOWED_CHARS = 'A-Za-z\.0-9';
    public abstract function parse(App $app);
}