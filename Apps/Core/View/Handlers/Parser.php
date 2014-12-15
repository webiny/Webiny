<?php
namespace Apps\Core\View\Handlers;

use Apps\Core\View\Handlers\Dom\Selector;
use Webiny\Platform\Responses\HtmlResponse;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Platform\Traits\TemplateEngineTrait;
use Webiny\Component\StdLib\StdLibTrait;

class Parser
{
    use StdLibTrait, PlatformTrait, TemplateEngineTrait;

    public function parse()
    {
        $uniqueId = uniqid('webiny-', true);
        $htpl = file_get_contents(__DIR__.'/Tmp/Content.htpl');
        $htpl = '<div id="'.$uniqueId.'">'.$htpl.'</div>';
        $selector = new Selector();
        $ifsParent = $selector->select($htpl, '/div[@id="'.$uniqueId.'"]//w-if[1]/..')[0];
        $rootHtml = $ifsParent['outerHtml'];
        $rootTag = $ifsParent['tag'];
        die($selector->replace($rootHtml, '//w-else', '<w-else></w-else>'));
        $ifBlocks = $selector->select($rootHtml, '/'.$rootTag.'/w-if');
        die(print_r($ifBlocks));
        return new HtmlResponse($html);
    }
}