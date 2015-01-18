<?php
namespace Apps\Core\View\Handlers\Parsers;

use Apps\Core\View\Handlers\Parser;

abstract class AbstractParser
{
    /**
     * @var Parser
     */
    protected $_parent;

    function __construct(Parser $parser)
    {
        $this->_parent = $parser;
    }

}