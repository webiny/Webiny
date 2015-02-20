<?php
namespace Apps\Core\Layout\Handlers;

use Apps\Core\Layout\Handlers\Dom\Selector;
use Apps\Core\Layout\Handlers\Parsers\IfParser;
use Apps\Core\Layout\Handlers\Parsers\LoopParser;
use Apps\Core\Layout\Handlers\Parsers\PlaceholderParser;
use Apps\Core\Layout\Handlers\Processors\AbstractProcessor;
use Apps\Core\Layout\Handlers\Processors\AttributesProcessor;
use Apps\Core\Layout\Handlers\Processors\BindAttributeProcessor;
use Apps\Core\Layout\Handlers\Processors\CssAttributeProcessor;
use Apps\Core\Layout\Handlers\Processors\EntitiesProcessor;
use Apps\Core\Layout\Handlers\Processors\JSXProcessor;
use Apps\Core\Layout\Handlers\Processors\TagsProcessor;
use Apps\Core\Layout\Handlers\Processors\WebinyTagsProcessor;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Platform\Traits\TemplateEngineTrait;
use Webiny\Component\StdLib\StdLibTrait;

class Parser
{
    use StdLibTrait, PlatformTrait, TemplateEngineTrait;

    private $_parsers = [];
    private $_processors = [];

    function __construct()
    {
        $this->_parsers = [
            new IfParser($this),
            new LoopParser($this),
            new PlaceholderParser($this)
        ];

        // Instantiate all available processors
        $this->_WebinyTagsProcessor = new WebinyTagsProcessor();
        $this->_TagsProcessor = new TagsProcessor();
        $this->_CssAttributeProcessor = new CssAttributeProcessor();
        $this->_JSXProcessor = new JSXProcessor();
        $this->_EntitiesProcessor = new EntitiesProcessor();
        $this->_BindAttributeProcessor = new BindAttributeProcessor();
        $this->_AttributesProcessor = new AttributesProcessor();

        // Assign processors that perform pre-processing
        $this->_preProcessors = [
            $this->_WebinyTagsProcessor,
            $this->_TagsProcessor,
            $this->_JSXProcessor,
            $this->_EntitiesProcessor
        ];

        // Assign processors that perform post-processing
        $this->_postProcessors = [
            $this->_TagsProcessor,
            $this->_JSXProcessor,
            $this->_CssAttributeProcessor,
            $this->_EntitiesProcessor,
            $this->_BindAttributeProcessor,
            $this->_AttributesProcessor
        ];
    }

    public function parse($tpl = '')
    {
        $workHtpl = $tpl;

        /** Run processors */
        /* @var $processor AbstractProcessor */
        foreach ($this->_preProcessors as $processor) {
            $workHtpl = $processor->preProcess($workHtpl);
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

        /** Run processors */
        foreach ($this->_postProcessors as $processor) {
            $workHtpl = $processor->postProcess($workHtpl);
        }

        return $workHtpl;
    }

    public function addReplacement($key, $value)
    {
        $this->_JSXProcessor->addValue($key, $value);
    }
}