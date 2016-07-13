<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools\Exceptions;

use Webiny\Component\StdLib\Exception\AbstractException;

/**
 * AppException can be used by any developer from any app to throw an exception
 *
 * @package         Apps\Core\Php\DevTools\Exceptions
 */
class AppException extends AbstractException
{
    /**
     * @var string Error message.
     */
    protected $message = '';

    /**
     * @var string Error code.
     */
    protected $errorCode = '';

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
     * @param array  $data
     */
    public function __construct($message, $errorCode = '', $data = [])
    {
        $this->message = $message;
        $this->errorCode = $errorCode;
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
     * @return array Returns the data attached to exception
     */
    public function getData()
    {
        return $this->data;
    }
}