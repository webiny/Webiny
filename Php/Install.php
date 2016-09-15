<?php
namespace Apps\Core\Php;

use Apps\Core\Php\DevTools\AbstractInstall;
use Apps\Core\Php\PackageManager\App;

class Install extends AbstractInstall
{
    protected function run(App $app)
    {
        // Insert permissions
        $permissions = json_decode(file_get_contents(__DIR__ . '/Install/UserPermissions.json'), true);
        $this->createUserPermissions($permissions);

        // Insert roles
        $roles = json_decode(file_get_contents(__DIR__ . '/Install/UserRoles.json'), true);
        $this->createUserRoles($roles);
    }
}