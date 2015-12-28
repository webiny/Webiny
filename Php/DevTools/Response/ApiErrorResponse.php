<?php
namespace Apps\Core\Php\DevTools\Response;

/**
 * Class ApiErrorResponse
 */
class ApiErrorResponse extends ApiResponse
{

    public function __construct($data, $msg = '', $code = '')
    {
        parent::__construct($data, true, $msg, $code);
    }
}