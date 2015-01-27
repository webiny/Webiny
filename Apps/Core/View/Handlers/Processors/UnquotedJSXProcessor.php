<?php
namespace Apps\Core\View\Handlers\Processors;

class UnquotedJSXProcessor extends AbstractProcessor
{
    protected $_regex = [
        '/(?=({{((?:[^{}]+|{(?2)})+)}}))/',
        '/(?=({((?:[^{}]+|{(?2)})+)}))/'
    ];

    public function extract($html)
    {
        $html = $this->_extractValues($html, $this->_regex[0]);

        return $this->_extractValues($html, $this->_regex[1]);
    }

    public function inject($html)
    {
        foreach ($this->_values as $key => $value) {
            $html = str_replace('"' . $key . '"', $value, $html);
        }

        return $this->_injectValues($html, $this->_values);
    }
}