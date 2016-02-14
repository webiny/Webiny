<?php
namespace Apps\Core\Php\Discover\Postman;

use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

class CustomMethods extends AbstractEndPoint
{
    public function getRequests()
    {


        return $this->requests;
    }
}
