<?php
namespace Apps\Core\View\Handlers\Processors;

class TagsProcessor extends AbstractProcessor
{
    protected $_regex = '/<\/[A-Z]+[\w+]+>|<[A-Z]+[\w+]+/';

    public function preProcess($html)
    {
        // Replace JSX components with valid html tag names
        preg_match_all($this->_regex, $html, $tags);

        if (count($tags[0]) > 0) {
            $tags = array_unique($tags[0]);
            foreach ($tags as $tag) {
                $uid = 'wby-parser-' . $this->str($tag)->caseLower()->trim('</>');
                if ($this->str($tag)->startsWith('</')) {
                    $uid = '</' . $uid . '>';
                } else {
                    $uid = '<' . $uid;
                }
                $this->_values[$uid] = $tag;
            }
        }

        if (count($this->_values) > 0) {
            uasort($this->_values, function ($a,$b){
                return strlen($b)-strlen($a);
            });
            
            $html = str_replace(array_values($this->_values), array_keys($this->_values), $html);
        }
        return $html;
    }

    public function postProcess($html)
    {
        return $this->_injectValues($html, $this->_values);
    }
}