<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\RequestHandlers;

use Apps\Core\Php\DevTools\Exceptions\AppException;

/**
 * ApiExceptions are thrown by the API methods.
 *
 * @package Apps\Core\Php\RequestHandlers
 */
class ApiException extends AppException
{
    /**
     * @var int Http response code that should be send with the error. Default is 404.
     */
    protected $responseCode = 404;

    public function __construct($message, $errorCode = '', $responseCode = 404, $data = [])
    {
        $this->responseCode = $responseCode;
        parent::__construct($message, $errorCode, $data);
    }

    /**
     * @param int|string $responseCode Http response code that should be send with the error. Default is 404.
     */
    public function setResponseCode($responseCode)
    {
        $this->responseCode = $responseCode;
    }

    /**
     * @return int Returns the http response code
     */
    public function getResponseCode()
    {
        return $this->responseCode;
    }
}