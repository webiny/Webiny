<?php
namespace Apps\Core\View\Handlers;

use Apps\Core\View\Handlers\Dom\Selector;
use Apps\Core\View\Handlers\Parsers\IfParser;
use Apps\Core\View\Handlers\Parsers\LoopParser;
use Apps\Core\View\Handlers\Parsers\PlaceholderParser;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Platform\Traits\TemplateEngineTrait;
use Webiny\Component\StdLib\StdLibTrait;

class Parser
{
    use StdLibTrait, PlatformTrait, TemplateEngineTrait;

    private $_quotedReplacements = [];
    private $_tagReplacements = [];
    private $_unquotedReplacements = [];
    private $_onEvents = [
        ' class='         => ' className=',
        ' valuelink='     => ' valueLink=',
        ' savestate='     => ' saveState=',
        ' oncopy='        => ' onCopy=',
        ' oncut='         => ' onCut=',
        ' onpaste='       => ' onPaste=',
        ' onkeydown='     => ' onKeyDown=',
        ' onkeypress='    => ' onKeyPress=',
        ' onkeyup='       => ' onKeyUp=',
        ' onfocus='       => ' onFocus=',
        ' onblur='        => ' onBlur=',
        ' onchange='      => ' onChange=',
        ' oninput='       => ' onInput=',
        ' onsubmit='      => ' onSubmit=',
        ' onclick='       => ' onClick=',
        ' ondoubleclick=' => ' onDoubleClick=',
        ' ondrag='        => ' onDrag=',
        ' ondragend='     => ' onDragEnd=',
        ' ondragenter='   => ' onDragEnter=',
        ' ondragexit='    => ' onDragExit=',
        ' ondragleave='   => ' onDragLeave=',
        ' ondragover='    => ' onDragOver=',
        ' ondragstart='   => ' onDragStart=',
        ' ondrop='        => ' onDrop=',
        ' onmousedown='   => ' onMouseDown=',
        ' onmouseenter='  => ' onMouseEnter=',
        ' onmouseleave='  => ' onMouseLeave=',
        ' onmousemove='   => ' onMouseMove=',
        ' onmouseout='    => ' onMouseOut=',
        ' onmouseover='   => ' onMouseOver=',
        ' onmouseup='     => ' onMouseUp=',
        ' ontouchcancel=' => ' onTouchCancel=',
        ' ontouchend='    => ' onTouchEnd=',
        ' ontouchmove='   => ' onTouchMove=',
        ' ontouchstart='  => ' onTouchStart=',
        ' onscroll='      => ' onScroll=',
        ' onwheel='       => ' onWheel='
    ];

    function __construct()
    {
        $this->_parsers = [
            new IfParser($this),
            new LoopParser($this),
            new PlaceholderParser($this)
        ];
    }

    public function parse($tpl)
    {
        $workHtpl = $tpl;

        // Replace component tags that begin with capital letters
        preg_match_all('/<\/[A-Z]+[a-z]+>|<[A-Z]+[a-z]+/', $workHtpl, $tags);

        if (count($tags[0]) > 0) {
            $tags = array_unique($tags[0]);
            foreach ($tags as $tag) {
                $uid = 'wby-parser-' . $this->str($tag)->caseLower()->trim('</>');
                if ($this->str($tag)->startsWith('</')) {
                    $uid = '</' . $uid . '>';
                } else {
                    $uid = '<' . $uid;
                }
                $this->_tagReplacements[$uid] = $tag;
            }
        }


        if (count($this->_tagReplacements) > 0) {
            $workHtpl = str_replace(array_values($this->_tagReplacements), array_keys($this->_tagReplacements),
                                    $workHtpl);
        }

        // Replace JSX with placeholders
        preg_match_all('/"{.*?}"/', $workHtpl, $matches);

        foreach ($matches[0] as $match) {
            $uid = uniqid('webiny-', true);
            $this->_quotedReplacements[$uid] = $match;
        }
        $workHtpl = str_replace(array_values($this->_quotedReplacements), array_keys($this->_quotedReplacements),
                                $workHtpl);

        preg_match_all('/({{.*?}}|{.*?})/', $workHtpl, $matches);
        foreach ($matches[0] as $match) {
            $uid = uniqid('webiny-', true);
            $this->_unquotedReplacements[$uid] = $match;
        }
        $workHtpl = str_replace(array_values($this->_unquotedReplacements), array_keys($this->_unquotedReplacements),
                                $workHtpl);

        // Run parsers
        $uniqueId = uniqid('webiny-', true);
        $workHtpl = '<div id="' . $uniqueId . '">' . $workHtpl . '</div>';

        // Run all parsers on given template
        $selector = new Selector();
        $workHtpl = $selector->select($workHtpl, '//div[@id="' . $uniqueId . '"]')[0]['content'];
        foreach ($this->_parsers as $parser) {
            $workHtpl = $parser->parse($workHtpl);
        }

        // Replace placeholders with actual JSX
        foreach ($this->_unquotedReplacements as $key => $value) {
            $workHtpl = str_replace('"' . $key . '"', $value, $workHtpl);
        }

        foreach (array_merge($this->_unquotedReplacements, $this->_quotedReplacements) as $key => $value) {
            $workHtpl = str_replace($key, $value, $workHtpl);
        }

        // Replace CSS class attribute with native JS className attribute
        $workHtpl = str_replace(array_keys($this->_onEvents), array_values($this->_onEvents), $workHtpl);

        // Replace tags
        if (count($this->_tagReplacements) > 0) {
            $workHtpl = str_replace(array_keys($this->_tagReplacements), array_values($this->_tagReplacements),
                                    $workHtpl);
        }

        return $workHtpl;
    }

    public function addQuotedReplacement($key, $value)
    {
        $this->_quotedReplacements[$key] = $value;
    }

    public function addUnquotedReplacement($key, $value)
    {
        $this->_unquotedReplacements[$key] = $value;
    }
}