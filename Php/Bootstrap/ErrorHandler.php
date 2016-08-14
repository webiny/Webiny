<?php
namespace Apps\Core\Php\Bootstrap;

use Apps\Core\Php\DevTools\Response\ApiErrorResponse;
use Apps\Core\Php\DevTools\WebinyTrait;
use Webiny\Component\Http\Response;

class ErrorHandler
{
    use WebinyTrait;

    private $isFatal = false;
    private $errors = [];
    private $codes = [
        E_USER_NOTICE       => 'notice',
        E_NOTICE            => 'notice',
        E_USER_WARNING      => 'warning',
        E_WARNING           => 'warning',
        E_CORE_WARNING      => 'warning',
        E_USER_ERROR        => 'error',
        E_ERROR             => 'error',
        E_PARSE             => 'fatal',
        E_CORE_ERROR        => 'fatal',
        E_COMPILE_ERROR     => 'fatal',
        E_COMPILE_WARNING   => 'fatal',
        E_RECOVERABLE_ERROR => 'fatal',
    ];

    function __construct()
    {
        set_error_handler([$this, 'logError'], E_ALL);
        set_exception_handler([$this, 'logException']);
        register_shutdown_function([$this, 'logFatalError']);
    }

    public function logError($errorCode, $errorMessage, $errorFile, $errorLine)
    {
        $error = [
            'msg'   => ($this->codes[$errorCode] ?? 'notice') . ': ' . $errorMessage,
            'stack' => print_r(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 3), true)
        ];

        if ($this->codes[$errorCode] == 'fatal') {
            $this->isFatal = true;
        }

        $this->saveError($error);
    }

    public function logException(\Throwable $e)
    {

        $backtrace = array_slice($e->getTrace(), 0, 3);
        foreach ($backtrace as &$item) {
            unset($item['object']);
            unset($item['args']);
            unset($item['type']);
        }

        $error = [
            'msg'   => 'exception: ' . $e->getMessage(),
            'stack' => print_r($backtrace, true)
        ];

        $this->isFatal = true;
        $this->saveError($error);
    }

    public function logFatalError()
    {
        $error = error_get_last();

        if (is_array($error) && $error['type'] != '') {
            $error = [
                'msg'   => ($this->codes[$error['type']] ?? 'notice') . ': ' . $error['message'],
                'stack' => print_r(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 3), true)
            ];

            $this->isFatal = true;
            $this->saveError($error);
        }
    }

    public function getErrors()
    {
        return $this->errors;
    }

    private function saveError(array $error)
    {
        // attach common stuff to the error
        $error['type'] = 'php';
        $error['date'] = time();
        $error['url'] = $this->wRequest()->getCurrentUrl();

        // hash error, so we don't report it multiple times
        $errorHash = md5($error['msg']);
        if (!isset($this->errors[$errorHash])) {
            $this->errors[$errorHash] = $error;
        }
        error_clear_last();

        // check error type
        if ($this->isFatal) {
            // return api error response in case of fatal errors

            // save errors to logger immediately in case of fatal errors
            // in case of other error types, the errors are automatically saved just before the response is sent back to the user
            $this->saveErrorsToLogger();

            // check if we want to display the errors or not
            $displayErrors = $this->wConfig()->get('Application.DisplayErrors', false);
            if ($displayErrors) {
                $data = $error;
            } else {
                $data = '';
            }

            // send the error response
            $response = new ApiErrorResponse($data, 'An error occurred on URL: ' . $this->wRequest()->getCurrentUrl(), 'W1');
            Response::create($response->output(), 503)->send();

            // exit the program after a fatal error
            die();
        }
    }

    public function saveErrorsToLogger()
    {
        if (count($this->errors) < 1) {
            return;
        }

        $url = $this->wConfig()->get('Application.ApiPath', false) . '/entities/core/logger-error-group/save-report';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(['errors' => $this->errors]));
        $result = curl_exec($ch);
        curl_close($ch);
    }
}
