<?php
namespace Apps\Core\View\Handlers\Processors;

class BindAttributeProcessor extends AbstractProcessor
{
    protected $_values = [];

    public function extract($html)
    {
        return $html;
    }

    public function inject($html)
    {
        $html = preg_replace('/\sbind="([A-Za-z-_\.]+)"/', ' valueLink={this.linkState("$1")}', $html);
        return $html;
    }
}