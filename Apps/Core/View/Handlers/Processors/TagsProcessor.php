<?php
namespace Apps\Core\View\Handlers\Processors;

class TagsProcessor extends AbstractProcessor
{
    protected $_regex = '/<\/[A-Z]+[a-z]+>|<[A-Z]+[a-z]+/';

    public function extract($html)
    {
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
            $html = str_replace(array_values($this->_values), array_keys($this->_values), $html);
        }
        return $html;
    }

    public function inject($html)
    {
        foreach ($this->_values as $key => $value) {
            $html = str_replace('"' . $key . '"', $value, $html);
        }

        return $this->_injectValues($html, $this->_values);
    }
}