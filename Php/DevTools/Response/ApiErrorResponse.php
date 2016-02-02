<?php
namespace Apps\Core\Php\DevTools\Response;

/**
 * Class ApiErrorResponse
 */
class ApiErrorResponse extends ApiResponse
{

    protected $errorCode;

    public function __construct($data, $msg = '', $errorCode = '', $httpStatus = 404)
    {
        $this->errorCode = $errorCode;
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