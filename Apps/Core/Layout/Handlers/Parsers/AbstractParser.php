<?php
namespace Apps\Core\Layout\Handlers\Parsers;

use Apps\Core\Layout\Handlers\Dom\Selector;
use Apps\Core\Layout\Handlers\Parser;

abstract class AbstractParser
{
    /**
     * @var Parser
     */
    protected $_parent;

    /**
     * @var Selector
     */
    protected $_selector;

    function __construct(Parser $parser)
    {
        $this->_parent = $parser;
        $this->_selector = new Selector();
    }

}