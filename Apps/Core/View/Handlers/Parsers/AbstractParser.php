<?php
namespace Apps\Core\View\Handlers\Parsers;

use Apps\Core\View\Handlers\Dom\Selector;
use Apps\Core\View\Handlers\Parser;

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