<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\RequestHandlers;

use Webiny\Component\Http\Http;
use Webiny\Component\StdLib\Exception\ExceptionAbstract;

/**
 * RestErrorExceptions are thrown by the api service methods.
 * Implemented methods can throw this exception to notify the rest component that there has been an error.
 *
 * @package         Webiny\Component\Rest
 */
class ApiException extends ExceptionAbstract
{
    /**
     * @var string Error message.
     */
    protected $message = '';

    /**
     * @var string Error description.
     */
    protected $description = '';

    /**
     * @var string Error code.
     */
    protected $errorCode = '';

    /**
     * @var int Http response code that should be send with the error. Default is 404.
     */
    protected $responseCode = 404;

    /**
     * Data attached to exception
     * @var array
     */
    protected $data = [];

    /**
     * Base constructor.
     *
     * @param string $message Error message
     * @param string $errorCode Error code
     * @param int    $responseCode Http response code that should be send with the error. Default is 404
     * @param array  $data
     */
    public function __construct($message, $errorCode = '', $responseCode = 404, $data = [])
    {
        $this->message = $message;
        $this->errorCode = $errorCode;
        $this->responseCode = $responseCode;
        $this->data = $data;
    }

    /**
     * Get the error message
     *
     * @return string
     */
    public function getErrorMessage()
    {
        return $this->message;
    }

    /**
     * Get error code
     *
     * @return string
     */
    public function getErrorCode()
    {
        return $this->errorCode;
    }

    /**
     * @param $responseCode Http response code that should be send with the error. Default is 404.
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

    /**
     * @return int Returns the data attached to exception
     */
    public function getData()
    {
        return $this->data;
    }
}