<?php
namespace Apps\Core\Php\Bootstrap;

class ErrorHandler
{
    private $errors = [];
    private $codes = [
        E_USER_NOTICE  => 'notice',
        E_USER_WARNING => 'warning',
        E_USER_ERROR   => 'error'
    ];

    function __construct()
    {
        set_error_handler([$this, 'logException'], E_ALL);
    }

    public function logException($errorCode, $errorMessage, $errorFile, $errorLine)
    {
        $backtrace = array_slice(debug_backtrace(), 1, 3);
        foreach ($backtrace as &$item) {
            unset($item['object']);
            unset($item['args']);
            unset($item['type']);
        }

        $error = [
            'type'      => isset($this->codes[$errorCode]) ? $this->codes[$errorCode] : 'notice',
            'message'   => $errorMessage,
            'file'      => $errorFile,
            'line'      => $errorLine,
            'trace'     => $backtrace
        ];

        $this->errors[] = $error;
    }

    public function getErrors()
    {
        return $this->errors;
    }
}
