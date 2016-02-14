<?php
namespace Apps\Core\Php\Discover\Postman;

use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

class CrudCreate extends AbstractEndPoint
{
    public function getRequests()
    {
        $this->requests[] = [
            'id'          => StringObject::uuid(),
            'headers'     => 'Authorization:{{authorization}}',
            'url'         => '{{url}}/api/entities/' . $this->ep->getAppSlug() . '/' . $this->ep->getEntitySlug(),
            'method'      => 'POST',
            'data'        => [],
            'dataMode'    => 'raw',
            'name'        => 'Create a ' . $this->ep->getEntityName(),
            'time'        => time(),
            'version'     => '' . $this->ep->getAppVersion(),
            'rawModeData' => $this->getRequestData()
        ];

        return $this->requests;
    }
}
