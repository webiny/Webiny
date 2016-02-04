<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class UserGroup
 *
 * @property string           $name
 * @property string           $tag
 * @property ArrayObject      $permissions
 * @property EntityCollection $users
 *
 * @package Apps\Core\Php\Entities
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
        $this->attr('name')->char()->setValidators('required');
        $this->attr('tag')->char()->setValidators('required')->onSet(function ($tag) {
            return $this->str($tag)->slug()->val();
        });
        $this->attr('users')->many2many('User2Group')->setEntity('\Apps\Core\Php\Entities\User');
        $this->attr('permissions')->object();
    }

    public function checkPermission($item, $permission){
        $group = $this->str($item)->explode('\\')->filter()->values()->val();

        // We ony handle the common namespace structure. Everything else will be ignored and returned as false
        if ($group[3] != 'Entities' && $group[3] != 'Services') {
            return false;
        }

        $key = strtolower($group[3]) . '.' . $item;

        if (!$this->permissions->keyExistsNested($key)) {
            return false;
        }

        $permissions = $this->permissions->keyNested($key);
        if (isset($permissions[$permission])) {
            return $permissions[$permission];
        }

        return false;
    }
}