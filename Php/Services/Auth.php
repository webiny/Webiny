<?php
namespace Apps\Core\Php\Services;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\Directory\Directory;
use Webiny\Component\Storage\File\File;

/**
 * Class Apps
 *
 * This service is used to authenticate users
 */
class Auth
{
    use DevToolsTrait, StdLibTrait;

    public function login()
    {
        $rd = $this->wRequest()->getRequestData();
        $data = $this->wLogin()->processLogin($rd['username']);
        $data['user'] = $this->wLogin()->getUser()->toArray('*,!password');

        return $data;
    }

    public function me()
    {
        $user = $this->wLogin()->getUser();
        $fields = $this->wRequest()->getFields('*,!password');

        if (!$user) {
            return null;
        }

        return $user->toArray($fields);
    }
}