<?php

namespace Apps\Webiny\Php\Services\Lib;

use Apps\Webiny\Php\Lib\Apps\JsApp;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

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
        $localName = $appData['localName'];
        $commands = [
            'cd ' . $this->wConfig()->get('Application.AbsolutePath'),
            'echo "Installing ' . $appData['name'] . '..."',
            // Composer is writing info messages to stderr so we redirect it to have all info in stdout pipe
            'composer require ' . $appData['packagist'] . ' 2>&1',
            'php ./Apps/Webiny/Php/Cli/install.php Local ' . $localName
        ];

        $this->run($this->sshCommand($commands), function (StringObject $line) {
            if ($line->contains('Warning')) {
                return;
            }
            $this->echo(['message' => $line->val()]);
        });


        // Installation finished - rebuild the app
        $this->echo(['message' => ' ']);
        $this->echo(['message' => '-------']);
        $this->echo(['message' => 'Don\'t worry when you see your CSS gone and requests begin to fail.']);
        $this->echo(['message' => 'As soon as your new app is built - everything will get back to normal :)']);
        $this->echo(['message' => '-------']);
        $this->echo(['message' => ' ']);
        $this->echo(['message' => 'Adding new app to your development build...']);
        $this->echo(['message' => 'Rebuilding apps, please wait...']);
        $this->echo(['message' => ' ']);


        // Get list of JS apps in the newly installed app
        $this->wApps()->enableApp($localName);
        $newApp = $this->wApps()->loadApp($localName);

        $jsApps = [];
        /* @var $jsApp JsApp */
        foreach ($newApp->getJsApps() as $jsApp) {
            $jsApps[] = $jsApp->getFullName();
        }

        $this->rebuildApps($jsApps);

        $this->echo(['progress' => 100, 'message' => 'Finished!']);

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
        $curl->setOpt(CURLOPT_WRITEFUNCTION, function ($curl, $data) {
            $this->echo(['cli' => $data]);

            return strlen($data);
        });
        $curl->get($bsPath . '/?action=rebuild&' . join('&', $apps));
    }

    private function sshCommand($commands)
    {
        $connection = 'ssh -i ' . $this->privateKey . ' -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no vagrant@localhost';

        return $connection . ' "' . join(' && ', $commands) . '" 2>&1';
    }

    private function echo ($data)
    {
        echo json_encode($data) . "_-_";
        flush();
    }

    private function run($command, $onLine)
    {
        $pipes = [];
        $descriptor = [['pipe', 'r'], ['pipe', 'w'], ['pipe', 'w']];

        $proc = proc_open($command, $descriptor, $pipes);
        fclose($pipes[0]);
        if (is_resource($proc)) {
            while ($f = fgets($pipes[1])) {
                $f = $this->str($f)->trim("\n");
                $onLine($f);
            }
            fclose($pipes[1]);

            while ($f = fgets($pipes[2])) {
                $f = $this->str($f)->trim("\n");
                $onLine($f);
            };
            proc_close($proc);
        }
    }
}