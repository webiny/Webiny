<?php

namespace Apps\Webiny\Php\Lib\Response;

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

    /**
     * Get response html
     *
     * @return string
     */
    public function getHtml()
    {
        return $this->html;
    }

    /**
     * Set response html
     *
     * @param string $html
     *
     * @return $this
     */
    public function setHtml($html)
    {
        $this->html = $html;

        return $this;
    }

    /**
     * Get response output
     *
     * @return string
     */
    public function output()
    {
        return $this->html;
    }
}