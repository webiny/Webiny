<?php
namespace Apps\Core\View\Handlers\Processors;

class QuotedJSXProcessor extends AbstractProcessor
{
    protected $_regex = '/(?=("{((?:[^{}]+|{(?2)})+)}"))/';

    public function extract($html)
    {
        return $this->_extractValues($html, $this->_regex);
    }

    public function inject($html)
    {
        return $this->_injectValues($html, $this->_values);
    }
}