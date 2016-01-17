<?php
namespace Apps\Core\Php\DevTools\Response;

/**
 * Class ApiErrorResponse
 */
class ApiErrorResponse extends ApiResponse
{

    private $description = '';

    public function __construct($data, $msg = '', $description = '', $code = '', $httpStatus = 404)
    {
        $this->description = $description;
        parent::__construct($data, true, $msg, $code, $httpStatus);
    }

    protected function formatResponse()
    {
        $response = parent::formatResponse();
        //$response['description'] = $this->description;

        return $response;
    }
}