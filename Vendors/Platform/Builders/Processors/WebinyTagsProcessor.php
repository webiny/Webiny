<?php
namespace Webiny\Platform\Builders\Processors;

class WebinyTagsProcessor extends AbstractProcessor
{
    protected $_regex = '/<\/[A-Z]+:[\w+]+>|<[A-Z]+:[\w+]+/';

    public function preProcess($html)
    {
        // Replace custom Webiny tags with valid html tag names
        $callback = function ($matches) {
            return $this->str($matches[0])->caseLower()->replace(':', '-')->val();
        };

        return preg_replace_callback($this->_regex, $callback, $html);
    }

    public function postProcess($html)
    {
        return $html;
    }
}