<?php
namespace Webiny\Platform\Builders\Backend;

use Webiny\Platform\Builders\Backend\Processors\LessVarProcessor;
use Webiny\Platform\Builders\Dom\Selector;
use Webiny\Platform\Builders\Backend\Parsers\IfParser;
use Webiny\Platform\Builders\Backend\Parsers\LoopParser;
use Webiny\Platform\Builders\Backend\Parsers\PlaceholderParser;
use Webiny\Platform\Builders\Backend\Processors\AbstractProcessor;
use Webiny\Platform\Builders\Backend\Processors\AttributesProcessor;
use Webiny\Platform\Builders\Backend\Processors\BindAttributeProcessor;
use Webiny\Platform\Builders\Backend\Processors\CssAttributeProcessor;
use Webiny\Platform\Builders\Backend\Processors\EntitiesProcessor;
use Webiny\Platform\Builders\Backend\Processors\JSXProcessor;
use Webiny\Platform\Builders\Backend\Processors\TagsProcessor;
use Webiny\Platform\Builders\Backend\Processors\WebinyTagsProcessor;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Platform\Traits\TemplateEngineTrait;
use Webiny\Component\StdLib\StdLibTrait;

class Parser
{
    use StdLibTrait, PlatformTrait, TemplateEngineTrait;

    private $_parsers = [];

    function __construct($isDevelopment)
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
        $this->_LessVarProcessor = new LessVarProcessor($isDevelopment);

        // Assign processors that perform pre-processing
        $this->_preProcessors = [
            $this->_LessVarProcessor,
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