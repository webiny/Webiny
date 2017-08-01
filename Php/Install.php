<?php
namespace Apps\Webiny\Php;

use Apps\Webiny\Php\Entities\ApiLog;
use Apps\Webiny\Php\PackageManager\App;
use MongoDB\Driver\Exception\RuntimeException;

class Install extends \Apps\Webiny\Php\DevTools\LifeCycle\Install
{
    public function run(App $app)
    {
        parent::run($app);

        // Insert permissions
        $permissions = json_decode(file_get_contents(__DIR__ . '/Install/UserPermissions.json'), true);
        $this->createUserPermissions($permissions);

        // Insert roles
        $roles = json_decode(file_get_contents(__DIR__ . '/Install/UserRoles.json'), true);
        $this->createUserRoles($roles);

        // Create a capped collection for ApiLogs
        $entityCollection = ApiLog::getEntityCollection();
        try {
            $this->wDatabase()->createCollection($entityCollection, [
                'capped' => true,
                'size'   => 2097152,
                'max'    => 2000
            ]);
        } catch (RuntimeException $e) {
            $this->wDatabase()->command([
                'convertToCapped' => $this->wDatabase()->getCollectionPrefix() . $entityCollection,
                'size'            => 2097152,
                'max'             => 2000
            ]);
        }
    }
}