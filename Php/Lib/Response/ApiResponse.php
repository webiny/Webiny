<?php

namespace Apps\Webiny\Php\Lib\Response;

use Apps\Webiny\Php\Lib\WebinyTrait;

/**
 * Class ApiResponse
 */
class ApiResponse extends AbstractResponse implements \ArrayAccess
{
    use WebinyTrait;

    protected $data;
    protected $msg;
    protected $phpTrace;

    /**
     * @param mixed  $data Response data
     * @param string $msg Response message
     * @param int    $httpStatus HTTP Status Code
     */
    public function __construct($data, $msg = '', $httpStatus = 200)
    {
        $this->data = $data;
        $this->msg = $msg;
        $this->statusCode = $httpStatus;
    }

    /**
     * Get original data
     *
     * @param bool $format
     *
     * @return mixed
     */
    public function getData($format = false)
    {
        return $format ? $this->formatResponse() : $this->data;
    }

    public function setData($data = [])
    {
        $this->data = $data;

        return $this;
    }

    /**
     * Get response message
     *
     * @return string
     */
    public function getMessage()
    {
        return $this->msg;
    }

    /**
     * Set response message
     *
     * @param string $message
     *
     * @return $this
     */
    public function setMessage($message)
    {
        $this->msg = $message;

        return $this;
    }

    public function output()
    {
        $data = $this->formatResponse();
        header("Content-type: application/json");

        return is_string($data) ? $data : json_encode($data, $this->wIsProduction() ? 0 : JSON_PRETTY_PRINT);
    }

    public function setErrors(array $errors)
    {
        $this->phpTrace = $errors;

        return $this;
    }

    /**
     * @inheritdoc
     */
    public function offsetExists($offset)
    {
        return isset($this->data[$offset]);
    }

    /**
     * @inheritdoc
     */
    public function offsetGet($offset)
    {
        return $this->data[$offset];
    }

    /**
     * @inheritdoc
     */
    public function offsetSet($offset, $value)
    {
        $this->data[$offset] = $value;
    }

    /**
     * @inheritdoc
     */
    public function offsetUnset($offset)
    {
        unset($this->data[$offset]);
    }

    protected function formatResponse()
    {
        $data = [
            'message' => $this->msg,
            'data'    => $this->data,
            'trace'   => $this->phpTrace
        ];

        if (!$this->msg) {
            unset($data['message']);
        }

        return $data;
    }
}