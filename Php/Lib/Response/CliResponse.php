<?php
namespace Apps\Webiny\Php\Lib\Response;

/**
 * Class ApiResponse
 */
class CliResponse extends AbstractResponse
{
    private $data;
    private $message;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function output()
    {
        header("Content-type: text/plain");

        $response = $this->data;
        if(is_array($this->data)){
            $response = print_r($this->data, true);
        }

        return $response;
    }

}
