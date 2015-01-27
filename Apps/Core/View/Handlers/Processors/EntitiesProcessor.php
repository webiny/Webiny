<?php
namespace Apps\Core\View\Handlers\Processors;

class EntitiesProcessor extends AbstractProcessor
{
    protected $_values = [];
    protected $_regex = '/&[a-z]+;/';

    public function extract($html)
    {
        return $this->_extractValues($html, $this->_regex);
    }

    public function inject($html)
    {
        return $this->_injectValues($html, $this->_values);
    }
}