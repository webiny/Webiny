<?php
namespace Webiny\Platform\Builders\Processors;

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