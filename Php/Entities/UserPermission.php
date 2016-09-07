<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class UserPermission
 *
 * @property string           $name
 * @property string           $slug
 * @property ArrayObject      $permissions
 *
 * @package Apps\Core\Php\Entities
 *
 */
class UserPermission extends AbstractEntity
{

    protected static $entityCollection = 'UserPermissions';
    protected static $entityMask = '{name}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('name')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('description')->char()->setToArrayDefault();
        $this->attr('slug')->char()->setValidators('required,unique')->onSet(function ($slug) {
            return $this->str($slug)->slug()->val();
        })->setToArrayDefault();
        $this->attr('roles')->many2many('UserRole2UserPermission')->setEntity('\Apps\Core\Php\Entities\UserRole');
        $this->attr('permissions')->object();
    }


    public function checkPermission($item, $permission)
    {
        $class = $this->str($item)->explode('\\')->filter()->values()->val();

        // We ony handle the common namespace structure. Everything else will be ignored and returned as false
        if ($class[3] != 'Entities' && $class[3] != 'Services') {
            return false;
        }

        $key = strtolower($class[3]) . '.' . $item;

        if (!$this->permissions->keyExistsNested($key)) {
            return false;
        }

        return $this->permissions->keyNested($key . '.' . $permission);
    }
}