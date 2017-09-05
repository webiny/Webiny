<?php
namespace Apps\Webiny\Php\Lib\Response;

/**
 * Class ApiRawResponse
 */
class ApiRawResponse extends ApiResponse
{

    protected function formatResponse()
    {
       return $this->data;
    }
}