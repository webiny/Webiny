<?php
namespace Apps\Core\Layout\Handlers\Processors;

class EntitiesProcessor extends AbstractProcessor
{
    protected $_values = [];
    protected $_regex = '/(?:&[a-z]+;|&&)/';

    public function preProcess($html)
    {
        return $this->_extractValues($html, $this->_regex);
    }

    public function postProcess($html)
    {
        return $this->_injectValues($html, $this->_values);
    }
}