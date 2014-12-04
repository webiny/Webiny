<?php
namespace Webiny\Platform\Responses;

/**
 * Class HtmlResponse
 * @package Platform
 */
class HtmlResponse extends ResponseAbstract
{
    protected $_html;

    public function __construct($html)
    {
        $this->_html = $html;
    }

    public function output()
    {
        return $this->_html;
    }
}