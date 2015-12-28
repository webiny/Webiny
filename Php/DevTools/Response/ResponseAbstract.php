<?php
namespace Apps\Core\Php\DevTools\Response;

/**
 * Class ResponseAbstract
 */
abstract class ResponseAbstract
{
    protected $statusCode = 200;

    abstract public function output();

    public function getStatusCode(){
        return $this->statusCode;
    }
}