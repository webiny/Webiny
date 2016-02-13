<?php
namespace Apps\Core\Php\DevTools\Response;

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