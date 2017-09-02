<?php

namespace Apps\Webiny\Php\Marketplace;

use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\Entities\User;
use Webiny\Component\Http\HttpTrait;

class MyProfile
{
    use WebinyTrait, HttpTrait;

    public function handle()
    {
        /* @var $user User */
        $user = $this->wAuth()->getUser();
        if (!$user) {
            $domainRoot = $this->wConfig()->get('Application.WebPath');
            $this->httpRedirect($domainRoot, [], 401);
            die();
        }

        $token = $user->meta['theHub']['token'] ?? '';
        $web = $this->wApps('Webiny')->getConfig()->get('Marketplace.Web', 'https://www.webiny.com');
        $this->httpRedirect($web . '/token/' . $token, [], 302);
        die();
    }
}