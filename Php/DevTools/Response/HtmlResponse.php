<?php
namespace Apps\Webiny\Php\DevTools\Response;

/**
 * Class HtmlResponse
 */
class HtmlResponse extends AbstractResponse
{
    protected $html;

    public function __construct($html, $statusCode = 200)
    {
        $this->html = $html;
        $this->statusCode = $statusCode;
    }

    public function output()
    {
        return $this->html;
    }
}