<?php

namespace Apps\Webiny\Php\Services\Lib;

use Apps\Webiny\Php\AppManager\AppLoader;
use Apps\Webiny\Php\AppManager\JsApp;
use Apps\Webiny\Php\DevTools\WebinyTrait;
use Webiny\Component\StdLib\StdLibTrait;

class AppInstaller
{
    use WebinyTrait, StdLibTrait;

    private $privateKey = '';

    public function setPrivateKey($path)
    {
        $this->privateKey = $path;

        return $this;
    }

    public function install($appData)
    {
        $appName = str_replace(' ', '', $appData['name']);
        $commands = [
            'cd ' . $this->wConfig()->get('Application.AbsolutePath'),
            'echo "Installing ' . $appData['name'] . ' app..."',
            'echo "__progress:10"',
            // Composer is writing info messages to stderr so we redirect it to have all info in stdout pipe
            'composer require ' . $appData['packagist'] . ' 2>&1',
            'echo "__progress:35"',
            'php ./Apps/Webiny/Php/Cli/install.php Local ' . $appName,
            'echo "__progress:65"'
        ];
        $pipes = [];
        $descriptor = [['pipe', 'r'], ['pipe', 'w'], ['pipe', 'w']];
        $proc = proc_open($this->generateCommand($commands), $descriptor, $pipes);
        fclose($pipes[0]);
        if (is_resource($proc)) {
            while ($f = fgets($pipes[1])) {
                $f = $this->str($f)->trim("\n");
                if ($f->contains('__progress')) {
                    $this->echo(['progress' => $f->explode(':')->last()->val()]);
                } else {
                    $this->echo(['message' => $f->val()]);
                }
            }
            fclose($pipes[1]);

            while ($f = fgets($pipes[2])) {
                $this->echo(['message' => $f]);
            };
            proc_close($proc);
        }

        $appsYaml = 'Configs/Base/Apps.yaml';
        $appsConfig = $this->wConfig()->parseConfig($appsYaml);
        $appsConfig->set('Apps.' . $appName, true);
        $this->wStorage('Root')->setContents($appsYaml, $appsConfig->getAsYaml());

        return true;

        // Installation finished - rebuild the app
        $this->echo(['message' => 'Adding new app to the development build...', 'progress' => 90]);
        $this->echo(['message' => 'Rebuilding apps, please wait...']);

        // Get list of JS apps in the newly installed app
        $apps = [];
        $newApp = AppLoader::getInstance()->loadApp($appName);
        /* @var $jsApp JsApp */
        foreach ($newApp->getJsApps() as $jsApp) {
            $apps[] = $jsApp->getFullName();
        }
        $this->rebuildApps($apps);

        $this->echo(['progress' => 100]);

        return true;
    }

    private function rebuildApps($apps = [])
    {
        if (count($apps) < 1) {
            return;
        }

        $apps = array_map(function ($app) {
            return 'app=' . $app;
        }, $apps);

        $bsConfig = file_get_contents($this->wStorage('Root')->getAbsolutePath('webiny.json'));
        $bsConfig = $this->arr(json_decode($bsConfig, true));
        $webPath = $this->wConfig()->get('Application.WebPath');

        $port = $bsConfig->keyNested('browserSync.port', 3000, true);
        $bsPath = $this->url($webPath)->setPort(intval($port) + 1);

        $curl = new \Curl\Curl();
        $curl->setTimeout(0);
        $curl->get($bsPath . '/?action=rebuild&' . join('&', $apps));
    }

    private function generateCommand($commands)
    {
        $connection = 'ssh -i ' . $this->privateKey . ' -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no vagrant@localhost';

        return $connection . ' "' . join(' && ', $commands) . '" 2>&1';
    }

    private function echo ($data)
    {
        echo json_encode($data) . "_-_";
        flush();
        usleep(200);
    }
}