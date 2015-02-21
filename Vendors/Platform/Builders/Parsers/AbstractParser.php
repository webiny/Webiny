<?php
namespace Webiny\Platform\Builders\Parsers;

use Webiny\Platform\Builders\Dom\Selector;
use Webiny\Platform\Builders\Parser;

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