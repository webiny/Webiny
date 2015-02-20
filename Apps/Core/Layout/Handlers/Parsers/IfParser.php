<?php
namespace Apps\Core\Layout\Handlers\Parsers;

use Apps\Core\Layout\Handlers\Dom\Selector;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Component\StdLib\StdLibTrait;

class IfParser extends AbstractParser
{
    use StdLibTrait, PlatformTrait;

    private $_html;

    public function parse($tpl)
    {
        $this->_html = $tpl;
        $originalTpl = $tpl;
        // Parse templates
        $uniqueId = uniqid('webiny-', true);
        $tpl = '<div id="' . $uniqueId . '">' . $tpl . '</div>';

        $selector = new Selector();
        $ifsParent = $selector->select($tpl, '//div[@id="' . $uniqueId . '"]//w-if[1]/..');
        if (count($ifsParent)) {
            $ifsParent = $ifsParent[0];
        } else {
            return $originalTpl;
        }
        $rootHtml = $ifsParent['outerHtml'];
        $rootTag = $ifsParent['tag'];
        $ifBlocks = $selector->select($rootHtml, '/' . $rootTag . '//w-if');

        if (count($ifBlocks)) {
            foreach ($ifBlocks as $ifBlock) {
                $attrs = $ifBlock['attributes'];
                $originalHtml = $ifBlock['outerHtml'];

                /*// First we need to determine the element that holds some <w-if> tags
                var nestedIfs = this._wrapForQuery(element).querySelectorAll("w-if");
                this._objectToArray(nestedIfs).forEach((nIf) => {
                    var parser = new IfParser();
                    var nIfHtml = parser.parse(nIf.outerHTML);
                    element.innerHTML = element.innerHTML.replace(nIf.outerHTML, parser.parse(nIfHtml));
                });*/

                // Conditional templates
                $templates = explode('<w-else/>', $ifBlock['content']);
                $templates[1] = isset($templates[1]) ? $templates[1] : false;

                // Create ReactJs
                $reactJs = $this->_createReactJs($attrs, $templates);
                $tpl = str_replace($originalHtml, $reactJs, $tpl);
            }
        }

        return $selector->select($tpl, '//div[@id="' . $uniqueId . '"]')[0]['content'];
    }


    private function _createReactJs($attrs, $templates)
    {
        // Check if template[0] needs wdiv wrapper
        list($lwdiv, $rwdiv) = $this->_templateWrapper($templates[0]);
        $ifTpl = "if(" . $attrs['cond'] . '){return ' . $lwdiv . trim($templates[0]) . $rwdiv . '}';

        if ($templates[1]) {
            list($lwdiv, $rwdiv) = $this->_templateWrapper($templates[1]);
            $ifTpl .= ' else { return ' . $lwdiv . trim($templates[1]) . $rwdiv . ';}';
        }

        return "{function(){" . $ifTpl . "}.bind(this)()}";
    }

    private function _templateWrapper($tpl)
    {
        $tpl = '<div id="wby-if-parser-wrapper-tester">'.$tpl.'</div>';
        $matches = $this->_selector->select(trim($tpl), '//div[@id="wby-if-parser-wrapper-tester"]/*');
        if (count($matches) == 1) {
            return [
                '',
                ''
            ];
        }

        return [
            '<wdiv>',
            '</wdiv>'
        ];
    }
}