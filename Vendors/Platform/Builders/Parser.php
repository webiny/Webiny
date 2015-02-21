<?php
namespace Webiny\Platform\Builders;

use Webiny\Platform\Builders\Dom\Selector;
use Webiny\Platform\Builders\Parsers\IfParser;
use Webiny\Platform\Builders\Parsers\LoopParser;
use Webiny\Platform\Builders\Parsers\PlaceholderParser;
use Webiny\Platform\Builders\Processors\AbstractProcessor;
use Webiny\Platform\Builders\Processors\AttributesProcessor;
use Webiny\Platform\Builders\Processors\BindAttributeProcessor;
use Webiny\Platform\Builders\Processors\CssAttributeProcessor;
use Webiny\Platform\Builders\Processors\EntitiesProcessor;
use Webiny\Platform\Builders\Processors\JSXProcessor;
use Webiny\Platform\Builders\Processors\TagsProcessor;
use Webiny\Platform\Builders\Processors\WebinyTagsProcessor;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Platform\Traits\TemplateEngineTrait;
use Webiny\Component\StdLib\StdLibTrait;

class Parser
{
    use StdLibTrait, PlatformTrait, TemplateEngineTrait;

    private $_parsers = [];

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