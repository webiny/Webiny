<?php
namespace Apps\Core\Php\Discover\Postman;

use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

class CrudGet extends AbstractEndPoint
{
    public function getRequests()
    {
        $this->requests[] = [
            'id'      => StringObject::uuid(),
            'headers' => 'Authorization:{{authorization}}',
            'url'     => '{{url}}/api/entities/' . $this->ep->getAppSlug() . '/' . $this->ep->getEntitySlug() . '/{{id}}',
            'method'  => 'GET',
            'data'    => [],
            'name'    => 'Get a single ' . $this->ep->getEntityName() . ' by ID',
            'time'    => time(),
            'version' => '' . $this->ep->getAppVersion()
        ];

        return $this->requests;
    }
}
