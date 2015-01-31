<?php
namespace Apps\Core\View\Handlers\Processors;

class JSXProcessor extends AbstractProcessor
{
    protected $_regex = [
        '/(?=({{((?:[^{}]+|{(?2)})+)}}))/',
        '/(?=({((?:[^{}]+|{(?2)})+)}))/',
        '/(?=("{((?:[^{}]+|{(?2)})+)}"))/'
    ];

    public function extract($html)
    {
        $html = $this->_extractValues($html, $this->_regex[0], true);
        $html = $this->_extractValues($html, $this->_regex[1], true);

        return $this->_extractValues($html, $this->_regex[2]);
    }

    public function inject($html)
    {
        return $this->_injectValues($html, $this->_values);
    }
}