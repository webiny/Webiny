<?php
namespace Apps\Core\View\Handlers;

use Apps\Core\View\Handlers\Dom\Selector;
use Apps\Core\View\Handlers\Parsers\IfParser;
use Apps\Core\View\Handlers\Parsers\LoopParser;
use Apps\Core\View\Handlers\Parsers\PlaceholderParser;
use Webiny\Platform\Responses\HtmlResponse;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Platform\Traits\TemplateEngineTrait;
use Webiny\Component\StdLib\StdLibTrait;

class Parser
{
    use StdLibTrait, PlatformTrait, TemplateEngineTrait;

    private $_quotedReplacements = [];
    private $_unquotedReplacements = [];

    function __construct(){
        $this->_parsers = [
            new IfParser($this),
            new LoopParser($this),
            new PlaceholderParser($this)
        ];
    }

    public function parse($tpl)
    {
        $workHtpl = $tpl;

        // Replace JSX with placeholders
        preg_match_all('/"{.*?}"/', $workHtpl, $matches);
        
        foreach($matches[0] as $match){
            $uid = uniqid('webiny-', true);
            $this->_quotedReplacements[$uid] = $match;
        }
        $workHtpl = str_replace(array_values($this->_quotedReplacements), array_keys($this->_quotedReplacements), $workHtpl);

        preg_match_all('/{.*?}/', $workHtpl, $matches);
        foreach($matches[0] as $match){
            $uid = uniqid('webiny-', true);
            $this->_unquotedReplacements[$uid] = $match;
        }
        $workHtpl = str_replace(array_values($this->_unquotedReplacements), array_keys($this->_unquotedReplacements), $workHtpl);

        // Run parsers
        $uniqueId = uniqid('webiny-', true);
        $workHtpl = '<div id="' . $uniqueId . '">' . $workHtpl . '</div>';

        // Run all parsers on given template
        $selector = new Selector();
        $workHtpl = $selector->select($workHtpl, '//div[@id="'.$uniqueId.'"]')[0]['content'];
        foreach($this->_parsers as $parser){
            $workHtpl = $parser->parse($workHtpl);
        }

        // Replace placeholders with actual JSX
        foreach($this->_unquotedReplacements as $key => $value){
            $workHtpl = str_replace('"'.$key.'"', $value, $workHtpl);
        }

        foreach(array_merge($this->_unquotedReplacements, $this->_quotedReplacements) as $key => $value){
            $workHtpl = str_replace($key, $value, $workHtpl);
        }

        // Replace CSS class attribute with native JS className attribute
        $workHtpl = str_replace(' class=', ' className=', $workHtpl);
        $workHtpl = str_replace(' onclick=', ' onClick=', $workHtpl);
        return $workHtpl;
    }

    public function addQuotedReplacement($key, $value){
        $this->_quotedReplacements[$key] = $value;
    }

    public function addUnquotedReplacement($key, $value){
        $this->_unquotedReplacements[$key] = $value;
    }
}