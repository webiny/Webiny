<?php
namespace Apps\Webiny\Php\Bootstrap;

use Apps\Webiny\Php\DevTools\Response\ApiErrorResponse;
use Apps\Webiny\Php\DevTools\Response\CliResponse;
use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\Entities\LoggerErrorGroup;
use Webiny\Component\Http\Response;

class ErrorHandler
{
    use WebinyTrait;

    private $isFatal = false;
    private $lastStackTrace = [];
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
        if($this->wConfig()->get('Application.Logger.Enabled', true)){
            set_error_handler([$this, 'logError'], E_ALL);
            set_exception_handler([$this, 'logException']);
            register_shutdown_function([$this, 'logFatalError']);
        }

        if($this->wConfig()->get('Application.Logger.DisplayErrors', false)){
            error_reporting(E_ALL);
            ini_set('display_errors', 1);
        }else{
            error_reporting(0);
            ini_set('display_errors', 0);
        }
    }

    public function logError($errorCode, $errorMessage, $errorFile, $errorLine)
    {
        $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 3);
        $error = [
            'msg'   => ($this->codes[$errorCode] ?? 'notice') . ': ' . $errorMessage,
            'stack' => print_r($backtrace, true)
        ];

        if ($this->codes[$errorCode] == 'fatal') {
            $this->isFatal = true;
            $this->lastStackTrace = $backtrace;
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
        $this->lastStackTrace = $backtrace;
        $this->saveError($error);
    }

    public function logFatalError()
    {
        $error = error_get_last();
        $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 3);

        if (is_array($error) && $error['type'] != '') {
            $error = [
                'msg'   => ($this->codes[$error['type']] ?? 'notice') . ': ' . $error['message'],
                'stack' => print_r($backtrace, true)
            ];

            $this->isFatal = true;
            $this->lastStackTrace = true;
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
            $displayErrors = $this->wConfig()->get('Application.Logger.DisplayErrors', false);
            if ($displayErrors) {
                $error['stack'] = $this->lastStackTrace; // we display it as array so when json_encode happens that the output looks nicer
                $data = $error;
            } else {
                $data = '';
            }

            // create the error response
            if(php_sapi_name() === 'cli'){
                $response = new CliResponse($data);
                $response = $response->output();
            }else{
                $response = new ApiErrorResponse($data, 'An error occurred on URL: ' . $this->wRequest()->getCurrentUrl(), 'W1');
                $response = $response->output(JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            }

            // send the response
            Response::create($response, 503)->send();

            // exit the program after a fatal error
            die();
        }
    }

    public function saveErrorsToLogger()
    {
        if (count($this->errors) < 1) {
            return;
        }

        try{
            $loggerErrorGroup = new LoggerErrorGroup();
            $loggerErrorGroup->saveReport($this->errors, []);
        }catch (\Exception $e){
            // show the error in case the connection to database is failing
            die(print_r($this->errors));
        }
    }
}
