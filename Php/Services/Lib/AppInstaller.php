<?php

namespace Apps\Webiny\Php\Services\Lib;

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
            $this->echo(json_decode($data, true));

            return strlen($data);
        });

        // Pick only the necessary data to send to CLI
        $cliData = [];
        $keys = ['id', 'name', 'localName', 'packagist', 'repository', 'version', 'webinyVersion'];
        foreach ($keys as $key) {
            $cliData[$key] = $appData[$key];
        }

        $curl->post($bsPath . '/?action=install', $cliData);

        return true;
    }

    private function echo ($data)
    {
        echo json_encode($data) . "_-_";
        flush();
    }
}