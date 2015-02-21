<?php
namespace Webiny\Platform\Builders\Processors;

class CssAttributeProcessor extends AbstractProcessor
{
    protected $_regex = '/(?=\sclass={((?:[^{}]+|{(?1)})+)})/';

    public function preProcess($html)
    {
        return $html;
    }

    public function postProcess($html)
    {
        preg_match_all($this->_regex, $html, $matches);

        $replacements = [];
        foreach ($matches[1] as $match) {
            $replacements[' class={' . $match . '}'] = ' class={this.classSet(' . $match . ')} class-obj={' . $match . '}';
        }

        return str_replace(array_keys($replacements), array_values($replacements), $html);
    }
}