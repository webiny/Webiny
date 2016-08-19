<?php
namespace Apps\Core\Php\DevTools\Response;

/**
 * Class AbstractResponse
 */
abstract class AbstractResponse implements ResponseInterface
{
    protected $statusCode = 200;

    public function getStatusCode(){
        return $this->statusCode;
    }
}