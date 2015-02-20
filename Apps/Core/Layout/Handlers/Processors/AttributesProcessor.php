<?php
namespace Apps\Core\Layout\Handlers\Processors;

class AttributesProcessor extends AbstractProcessor
{
    protected $_values = [
        ' class='         => ' className=',
        ' valuelink='     => ' valueLink=',
        ' colspan='       => ' colSpan=',
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

    public function preProcess($html)
    {
        return $html;
    }

    public function postProcess($html)
    {
        return $this->_injectValues($html, $this->_values);
    }
}