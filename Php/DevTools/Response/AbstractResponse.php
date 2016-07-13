<?php
namespace Apps\Core\Php\DevTools\Response;

/**
 * Class AbstractResponse
 */
abstract class AbstractResponse
{
    protected $statusCode = 200;

    abstract public function output();

    public function getStatusCode(){
        return $this->statusCode;
    }
}