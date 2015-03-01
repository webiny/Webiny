<?php
namespace Webiny\Platform\Builders\Backend\Processors;

class LessVarProcessor extends AbstractProcessor
{
    protected $_regex = '/@{([\w+]+)_([\w+]+)}/';

    function __construct($isDevelopment)
    {
        $this->_isDevelopment = $isDevelopment;
    }


    public function preProcess($html)
    {
        $production = '/Apps/$1/Build/Production/Backend/$2/Assets';
        $development = '/Apps/$1/Backend/$2/Assets';

        $replacement = $this->_isDevelopment ? $development : $production;
        $html = preg_replace($this->_regex, $replacement, $html);

        return $html;
    }

    public function postProcess($html)
    {
        return $html;
    }
}