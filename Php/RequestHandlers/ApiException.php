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
    protected $code = '';

    /**
     * @var int Http response code that should be send with the error. Default is 404.
     */
    protected $responseCode = 404;

    /**
     * @var array Additional error messages. Useful if you wish to return a validation error, this can be used to
     *            store errors per-field.
     */
    protected $errors = [];


    /**
     * Base constructor.
     *
     * @param string $message      Error message.
     * @param string $description  Error description.
     * @param string $code         Error code.
     * @param int    $responseCode Http response code that should be send with the error. Default is 404.
     */
    public function __construct($message, $description = '', $code = '', $responseCode = 404)
    {
        $this->message = $message;
        $this->description = $description;
        $this->code = $code;
        $this->responseCode = $responseCode;
    }

    /**
     * Add an additional error to the exception.
     *
     * @param array $error Addition error.
     */
    public function addError(array $error)
    {
        $this->errors[] = $error;
    }

    /**
     * Get the list of all additional errors.
     *
     * @return array
     */
    public function getErrors()
    {
        return $this->errors;
    }

    /**
     * Get the error message.
     *
     * @return string
     */
    public function getErrorMessage()
    {
        return $this->message;
    }

    /**
     * Get error description.
     *
     * @return string
     */
    public function getErrorDescription()
    {
        return $this->description;
    }

    /**
     * Get error code.
     *
     * @return string
     */
    public function getErrorCode()
    {
        return $this->code;
    }

    /**
     * @param $responseCode Http response code that should be send with the error. Default is 404.
     */
    public function setResponseCode($responseCode)
    {
        $this->responseCode = $responseCode;
    }

    /**
     * @return int Returns the http response code.
     */
    public function getResponseCode()
    {
        return $this->responseCode;
    }
}