<?php

namespace Apps\Webiny\Php\Lib\Response;

use Webiny\Component\Http\Response\CacheControl;

/**
 * Class AbstractResponse
 */
abstract class AbstractResponse implements ResponseInterface
{
    protected $statusCode = 200;

    public function getStatusCode()
    {
        return $this->statusCode;
    }

    public function setStatusCode($code)
    {
        $this->statusCode = $code;

        return $this;
    }

    public function getCacheControlHeaders()
    {
        $cc = new CacheControl();
        $cc->setAsDontCache();

        return $cc->getCacheControl();
    }
}