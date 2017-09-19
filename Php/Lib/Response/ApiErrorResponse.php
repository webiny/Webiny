<?php

namespace Apps\Webiny\Php\Lib\Response;

/**
 * Class ApiErrorResponse
 */
class ApiErrorResponse extends ApiResponse
{
    /**
     * Default HTTP status code for error response if $httpStatus parameter is not explicitly passed to constructor
     * @var int
     */
    public static $ERROR_STATUS_CODE = 404;
    protected $errorCode;

    public function __construct($data, $msg = '', $errorCode = '', $httpStatus = null)
    {
        $this->errorCode = $errorCode;
        if (!$httpStatus) {
            $httpStatus = static::$ERROR_STATUS_CODE;
        }

        parent::__construct($data, $msg, $httpStatus);
    }

    protected function formatResponse()
    {
        $data = parent::formatResponse();
        $data['code'] = $this->errorCode;
        $data['message'] = $this->msg;

        return $data;
    }
}