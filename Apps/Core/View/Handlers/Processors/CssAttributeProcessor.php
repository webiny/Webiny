<?php
namespace Apps\Core\View\Handlers\Processors;

class CssAttributeProcessor extends AbstractProcessor
{
    protected $_regex = [
        '/ class={{(.*?)}}/',
        '/ class={(.*?)}/'
    ];

    public function preProcess($html)
    {
        return $html;
    }

    public function postProcess($html)
    {

        $html = preg_replace($this->_regex[0], ' class={this.classSet({$1})}', $html);

        // TODO: Ovaj ovdje regex replace-a internu grupu i zato dupli classSet dobijem van
        //$html = preg_replace($this->_regex[1], ' class={this.classSet($1)}', $html);

        if($this->str($html)->contains('danger')){
            die($html);
        }

        return $html;

    }
}