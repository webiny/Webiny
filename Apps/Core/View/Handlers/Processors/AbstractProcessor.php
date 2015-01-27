<?php
namespace Apps\Core\View\Handlers\Processors;

use Webiny\Component\StdLib\StdLibTrait;

abstract class AbstractProcessor
{
    use StdLibTrait;

    protected $_values = [];
    protected $_regex = '';

    abstract public function extract($html);

    abstract public function inject($html);

    public function addValue($key, $value){
        $this->_values[$key] = $value;
    }

    protected function _extractValues($html, $regex){
        preg_match_all($regex, $html, $matches);

        $matches = isset($matches[1]) ? $matches[1] : $matches[0];
        foreach ($matches as $match) {
            $uid = uniqid('webiny-', true);
            $this->_values[$uid] = $match;
        }
        return str_replace(array_values($this->_values), array_keys($this->_values), $html);
    }

    protected function _injectValues($html, $values){
        return str_replace(array_keys($values), array_values($values), $html);
    }

}