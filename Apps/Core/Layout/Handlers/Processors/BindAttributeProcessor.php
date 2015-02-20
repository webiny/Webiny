<?php
namespace Apps\Core\Layout\Handlers\Processors;

class BindAttributeProcessor extends AbstractProcessor
{
    protected $_values = [];

    public function preProcess($html)
    {
        return $html;
    }

    public function postProcess($html)
    {
        return preg_replace('/\sbind="([A-Za-z-_\.]+)"/', ' valueLink={this.linkState("$1")}', $html);
    }
}