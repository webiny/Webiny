<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Webiny\Component\Mongo\Index\SingleIndex;

/**
 * Class UserGroup
 *
 * @property string $name
 *
 * @package Ht\Entities
 *
 */
class UserGroup extends EntityAbstract
{

    protected static $entityCollection = 'UserGroup';
    protected static $entityMask = '{name}';

    /**
     * This method is called during instantiation to build entity structure
     * @return void
     */
    protected function entityStructure()
    {
        $this->attr('name')->char();
        $this->attr('users')->many2many('User2Group')->setEntity('\Apps\Core\Php\Entities\User');
        $this->attr('permissions')->object();
    }

    /**
     * Check if given permission is granted on given entity
     *
     * @param string $entity Entity class
     * @param string $permission c,r,u,d or any other entity method
     *
     * @return bool
     */
    public function checkPermission($entity, $permission)
    {
        if (!isset($this->permissions[$entity])) {
            return false;
        }

        $entityPermissions = $this->permissions[$entity];
        if (isset($entityPermissions[$permission])) {
            return $entityPermissions[$permission];
        }

        return false;
    }
}