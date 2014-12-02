<?php
namespace Platform\Responses;

/**
 * Class ResponseAbstract
 * @package Platform
 */
abstract class ResponseAbstract
{
    function __construct()
    {
        //
    }


    abstract public function output();
}