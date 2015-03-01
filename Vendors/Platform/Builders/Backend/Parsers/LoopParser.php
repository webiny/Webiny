<?php
namespace Webiny\Platform\Builders\Backend\Parsers;

use Webiny\Platform\Builders\Dom\Selector;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Component\StdLib\StdLibTrait;

class LoopParser extends AbstractParser
{
    use StdLibTrait, PlatformTrait;

    private $_defaultAttrs = [
        'as'    => 'item',
        'index' => 'index',
        'items' => ''
    ];
    private $_attrs;
    private $_itemTpl;
    private $_html;

    public function parse($tpl)
    {
        $this->_html = $tpl;
        $originalTpl = $tpl;
        // Parse templates
        $uniqueId = uniqid('webiny-', true);
        $tpl = '<div id="' . $uniqueId . '">' . $tpl . '</div>';

        $selector = new Selector();
        $loopParent = $selector->select($tpl, '//div[@id="' . $uniqueId . '"]//w-loop[1]/..');
        if(count($loopParent)){
            $loopParent = $loopParent[0];
        } else {
            return $originalTpl;
        }
        $rootHtml = $loopParent['outerHtml'];
        $rootTag = $loopParent['tag'];
        $loopBlocks = $selector->select($rootHtml, '/' . $rootTag . '/w-loop');

        if (count($loopBlocks)) {
            foreach ($loopBlocks as $loopBlock) {
                $this->_attrs = $this->_getAttributes($loopBlock);
                $this->_itemTpl = $loopBlock['content'];
                $originalHtml = $loopBlock['outerHtml'];

                /*// First we need to determine the element that holds some <w-if> tags
                var nestedIfs = this._wrapForQuery(element).querySelectorAll("w-if");
                this._objectToArray(nestedIfs).forEach((nIf) => {
                    var parser = new IfParser();
                    var nIfHtml = parser.parse(nIf.outerHTML);
                    element.innerHTML = element.innerHTML.replace(nIf.outerHTML, parser.parse(nIfHtml));
                });*/

                $this->_itemTpl = $this->_injectKey($this->_itemTpl);

                // If item template is wrapped in {}, we need to remove the braces
                // If not removed, the following syntax occurs: return {function(){...}} -> JSX breaks!
                if($this->str($this->_itemTpl)->startsWith('{')){
                    $this->_itemTpl = trim($this->_itemTpl, '{}');
                }

                // Create ReactJs
                $reactJs = $this->_createReactJs();
                $tpl = str_replace($originalHtml, $reactJs, $tpl);
            }
        }

        return $selector->select($tpl, '//div[@id="' . $uniqueId . '"]')[0]['content'];
    }

    private function _injectKey($item)
    {
        // Inject 'key' attribute
        $firstTagRegex = '/(<[\w-]+[^\s>])/';

        $key = uniqid('webiny-', true);
        $value = '{' . $this->_attrs['index'] . '}';

        // Add attribute replacement to JSX processor
        $this->_parent->addReplacement('"'. $key. '"', $value);
        return preg_replace($firstTagRegex, '$1 key='.$key, trim($item), 1);
    }

    private function _createReactJs()
    {
        $lDelim = '{';
        $rDelim = '}';

        return "\n" . $lDelim . $this->_attrs['items'] . '.map(function(' . $this->_attrs['as'] . ', ' . $this->_attrs['index'] . '){return ' . $this->_itemTpl . '}.bind(this))' . $rDelim;
    }

    private function _parseItemTemplate($html)
    {
        if (strpos($html, 'w-loop') > -1) {
            $lp = new LoopParser();
            $html = $lp->parse($html);
        }

        return $this->_injectKey($html);
    }

    private function _getAttributes($loopBlock){
        $attrs = array_merge($this->_defaultAttrs, $loopBlock['attributes']);
        $attrs['items'] = trim($attrs['items'], "{}");
        
        return $attrs;
    }
}