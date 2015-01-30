<?php
namespace Apps\Core\View\Handlers;

use Apps\Core\View\Handlers\Dom\Selector;
use Apps\Core\View\Handlers\Parsers\IfParser;
use Apps\Core\View\Handlers\Parsers\LoopParser;
use Apps\Core\View\Handlers\Parsers\PlaceholderParser;
use Apps\Core\View\Handlers\Processors\AbstractProcessor;
use Apps\Core\View\Handlers\Processors\AttributesProcessor;
use Apps\Core\View\Handlers\Processors\BindAttributeProcessor;
use Apps\Core\View\Handlers\Processors\EntitiesProcessor;
use Apps\Core\View\Handlers\Processors\QuotedJSXProcessor;
use Apps\Core\View\Handlers\Processors\TagsProcessor;
use Apps\Core\View\Handlers\Processors\UnquotedJSXProcessor;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Platform\Traits\TemplateEngineTrait;
use Webiny\Component\StdLib\StdLibTrait;

class Parser
{
    use StdLibTrait, PlatformTrait, TemplateEngineTrait;

    function __construct()
    {
        $this->_parsers = [
            new IfParser($this),
            new LoopParser($this),
            new PlaceholderParser($this)
        ];

        $this->_processors = [
            'tags'          => new TagsProcessor(),
            'quoted'        => new QuotedJSXProcessor(),
            'unquoted'      => new UnquotedJSXProcessor(),
            'attributes'    => new AttributesProcessor(),
            'entities'      => new EntitiesProcessor(),
            'bindAttribute' => new BindAttributeProcessor()
        ];
    }

    public function parse($tpl = '')
    {
        $workHtpl = $tpl;

        /** Run processors (extract values for later replacement) */
        /* @var $processor AbstractProcessor */
        foreach ($this->_processors as $processor) {
            $workHtpl = $processor->extract($workHtpl);
        }

        /** Run parsers */
        $uniqueId = uniqid('webiny-', true);
        $workHtpl = '<div id="' . $uniqueId . '">' . $workHtpl . '</div>';

        /** Run all parsers on given template */
        $selector = new Selector();
        $workHtpl = $selector->select($workHtpl, '//div[@id="' . $uniqueId . '"]')[0]['content'];
        foreach ($this->_parsers as $parser) {
            $workHtpl = $parser->parse($workHtpl);
        }

        /** Run processors (inject values extracted at the beginning of the process) */
        foreach ($this->_processors as $processor) {
            $workHtpl = $processor->inject($workHtpl);
        }

        /*if($this->str($tpl)->contains('bind=')){
            die($workHtpl);
        }*/

        return $workHtpl;
    }

    public function addQuotedReplacement($key, $value)
    {
        $this->_processors['quoted']->addValue($key, $value);
    }

    public function addUnquotedReplacement($key, $value)
    {
        $this->_processors['unquoted']->addValue($key, $value);
    }
}