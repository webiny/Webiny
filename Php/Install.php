<?php
namespace Apps\Core\Php;

use Apps\Core\Php\DevTools\AbstractInstall;
use Apps\Core\Php\Entities\UserPermission;
use Apps\Core\Php\Entities\UserRole;
use Apps\Core\Php\PackageManager\App;
use Webiny\Component\Entity\EntityException;

class Install extends AbstractInstall
{
    protected function run(App $app)
    {
        // Insert permissions
        $permissions = json_decode(file_get_contents(__DIR__ . '/Install/UserPermissions.json'), true);
        foreach ($permissions as $perm) {
            try {
                $p = new UserPermission();
                $p->populate($perm)->save();
            } catch (EntityException $e) {
                continue;
            }
        }

        // Insert roles
        $roles = json_decode(file_get_contents(__DIR__ . '/Install/UserRoles.json'), true);
        foreach ($roles as $role) {
            try {
                $r = new UserRole();
                $r->populate($role)->save();
            } catch (EntityException $e) {
                continue;
            }
        }
    }
}