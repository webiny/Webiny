<?php
use Apps\Webiny\Php\Entities\UserPermission;

$autoloader = require_once getcwd() . '/vendor/autoload.php';
$autoloader->addPsr4('Apps\\Webiny\\', getcwd() . '/Apps/Webiny');

class Migrate extends \Apps\Webiny\Php\Lib\AbstractCli
{
    private $map = [
        'crudCreate' => 'c',
        'crudRead'   => 'r',
        'crudUpdate' => 'u',
        'crudDelete' => 'd'
    ];

    public function run()
    {
        $results = UserPermission::find();
        /* @var $p UserPermission */
        foreach ($results as $p) {
            $current = array_merge($p['permissions']['entities'] ?? [], $p['permissions']['services'] ?? []);
            $new = [];
            foreach ($current as $class => $permissions) {
                $key = $this->str($class)->replace('Apps\\', '')->replace('\\Php\\', '.')->replace('\\', '.')->val();
                $perm = ['classId' => $key, 'rules' => []];
                foreach ($permissions as $url => $rules) {
                    $perm['rules'][$this->map[$url] ?? $url] = $rules;
                }
                $new[] = $perm;
            }

            $p->permissions = $new;
            $p->save();
        }
    }
}

$release = new Migrate();
$release->run();

