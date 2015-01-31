<?php
namespace Apps\Core\View\Handlers\Processors;

class BindAttributeProcessor extends AbstractProcessor
{
    protected $_values = [];

    public function preProcess($html)
    {
        return $html;
    }

    public function postProcess($html)
    {
        $html = preg_replace('/\sbind="([A-Za-z-_\.]+)"/', ' valueLink={this.linkState("$1")}', $html);
        return $html;
    }
}