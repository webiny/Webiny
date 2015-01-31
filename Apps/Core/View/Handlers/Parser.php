<?php
namespace Apps\Core\View\Handlers;

use Apps\Core\View\Handlers\Dom\Selector;
use Apps\Core\View\Handlers\Parsers\IfParser;
use Apps\Core\View\Handlers\Parsers\LoopParser;
use Apps\Core\View\Handlers\Parsers\PlaceholderParser;
use Apps\Core\View\Handlers\Processors\AbstractProcessor;
use Apps\Core\View\Handlers\Processors\AttributesProcessor;
use Apps\Core\View\Handlers\Processors\BindAttributeProcessor;
use Apps\Core\View\Handlers\Processors\CssAttributeProcessor;
use Apps\Core\View\Handlers\Processors\EntitiesProcessor;
use Apps\Core\View\Handlers\Processors\JSXProcessor;
use Apps\Core\View\Handlers\Processors\TagsProcessor;
use Apps\Core\View\Handlers\Processors\WebinyTagsProcessor;
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
            'webinyTags'    => new WebinyTagsProcessor(),
            'tags'          => new TagsProcessor(),
            'cssAttribute'  => new CssAttributeProcessor(),
            'jsx'           => new JSXProcessor(),
            'entities'      => new EntitiesProcessor(),
            'bindAttribute' => new BindAttributeProcessor(),
            'attributes'    => new AttributesProcessor()
        ];

        $this->_preProcessors = [
            $this->_processors['webinyTags'],
            $this->_processors['tags'],
            $this->_processors['jsx'],
            $this->_processors['entities'],
            $this->_processors['bindAttribute'],
            $this->_processors['attributes']
        ];

        $this->_postProcessors = [
            $this->_processors['webinyTags'],
            $this->_processors['tags'],
            $this->_processors['jsx'],
            $this->_processors['cssAttribute'],
            $this->_processors['entities'],
            $this->_processors['bindAttribute'],
            $this->_processors['attributes']
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
        $this->_processors['jsx']->addValue($key, $value);
    }
}