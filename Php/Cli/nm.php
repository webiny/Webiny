<?php
use Apps\NotificationManager\Php\Entities\Notification;

if (php_sapi_name() !== 'cli') {
    die('Invalid invocation!');
}

$autoloader = require_once getcwd() . '/vendor/autoload.php';
$autoloader->addPsr4('Apps\\Core\\', getcwd() . '/Apps/Core');

class Nm
{
    use \Webiny\Component\StdLib\StdLibTrait, \Apps\Core\Php\DevTools\WebinyTrait, \Webiny\Component\Mongo\MongoTrait;

    public function run()
    {
        $_SERVER = [];
        $_SERVER['SERVER_NAME'] = $this->url('http://selecto.app')->getHost();
        \Apps\Core\Php\Bootstrap\Bootstrap::getInstance();

        $records = $this->mongo()->find(Notification::getEntityCollection());

        foreach ($records as $r) {
            echo $r['title'] . "\n";
            $r['handlers']['email'] = $r['email'];
            $r['handlers']['email']['template'] = $r['template'];
            $r['handlers']['email']['send'] = true;
            unset($r['template']);
            unset($r['email']);
            $this->mongo()->findOneAndUpdate(Notification::getEntityCollection(), ['id' => $r['id']], ['$set' => $r, '$unset' => ['email' => '', 'template' => '']]);
        }
    }
}

$release = new Nm();
$release->run();

