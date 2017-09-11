<?php

namespace Apps\Webiny\Php\Services\Lib;

use Apps\Webiny\Php\Entities\User;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\StdLib\StdLibTrait;

class AppInstaller
{
    use WebinyTrait, StdLibTrait;

    public function install($appData)
    {
        $bsConfig = file_get_contents($this->wStorage('Root')->getAbsolutePath('webiny.json'));
        $bsConfig = $this->arr(json_decode($bsConfig, true));
        $webPath = $this->wConfig()->get('Application.WebPath');

        $port = $bsConfig->keyNested('browserSync.port', 3000, true);
        $bsPath = $this->url($webPath)->setPort(intval($port) + 1);

        $curl = new \Curl\Curl();
        $curl->setTimeout(0);
        $curl->setOpt(CURLOPT_WRITEFUNCTION, function ($curl, $data) {
            $res = json_decode($data, true);
            $this->echo($res);
            if (isset($res['error'])) {
                // Throw to abort installation
                throw new AppException($res['error']);
            }

            return strlen($data);
        });

        // Pick only the necessary data to send to CLI
        $cliData = [];
        $keys = ['id', 'name', 'localName', 'packagist', 'repository', 'version', 'webinyVersion'];
        foreach ($keys as $key) {
            $cliData[$key] = $appData[$key];
        }

        $curl->post($bsPath . '/?action=install', $cliData);

        // If we got this far it means everything is ok and now we need to assign admin roles
        $app = $this->wApps()->loadApp($appData['localName']);

        /* @var $user User */
        $user = $this->wAuth()->getUser();
        /* @var $install \Apps\Webiny\Php\Lib\LifeCycle\Install */
        $install = $app->getLifeCycleObject('Install');
        foreach ($install->getUserRoles() as $role) {
            if ($role['isAdminRole'] ?? false) {
                $user->roles[] = $role['slug'];
            }
        }

        // Save user and send new user roles to the client
        if ($user->save()) {
            $this->echo($user->toArray('roles.slug'));
        }

        return true;
    }

    private function echo ($data)
    {
        echo json_encode($data) . "_-_";
        flush();
    }
}