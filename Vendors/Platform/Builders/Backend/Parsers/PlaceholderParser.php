<?php
namespace Webiny\Platform\Builders\Backend\Parsers;

use Webiny\Platform\Builders\Dom\Selector;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Component\StdLib\StdLibTrait;

class PlaceholderParser extends AbstractParser
{
    use StdLibTrait, PlatformTrait;

    public function parse($tpl)
    {
        $selector = new Selector();
        $placeholders = $selector->select($tpl, '//w-placeholder');
        
        if (count($placeholders)) {
            foreach ($placeholders as $placeholder) {
                $originalHtml = $placeholder['outerHtml'];

                // Create ReactJs
                $reactJs = '{function(){return ComponentLoader.getComponents("' . $placeholder['attributes']['name'] . '");}.bind(this)()}';
                $tpl = str_replace($originalHtml, $reactJs, $tpl);
            }
        }

        return $tpl;
    }
}