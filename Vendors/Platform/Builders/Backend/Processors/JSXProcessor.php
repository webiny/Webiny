<?php
namespace Webiny\Platform\Builders\Backend\Processors;

class JSXProcessor extends AbstractProcessor
{
    protected $_regex = [
        '/(?=({{((?:[^{}]+|{(?2)})+)}}))/',
        '/(?=({((?:[^{}]+|{(?2)})+)}))/',
        '/(?=("{((?:[^{}]+|{(?2)})+)}"))/'
    ];

    public function preProcess($html)
    {
        $html = $this->_extractValues($html, $this->_regex[0], true);
        $html = $this->_extractValues($html, $this->_regex[1], true);

        return $this->_extractValues($html, $this->_regex[2]);
    }

    public function postProcess($html)
    {
        $html = $this->_injectValues($html, $this->_values);
        return $html;
    }
}