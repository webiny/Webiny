<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\Mongo\Index\CompoundIndex;

/**
 * Class UserRole
 *
 * @property string           $name
 * @property string           $description
 * @property string           $slug
 * @property EntityCollection $permissions
 * @property EntityCollection $users
 * @property EntityCollection $apiTokens
 */
class UserRole extends AbstractEntity
{
    protected static $classId = 'Webiny.Entities.UserRole';
    protected static $collection = 'UserRoles';
    protected static $mask = '{name}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('name')->char()->setValidators('required')->setToArrayDefault()->onSet(function ($name) {
            if (!$this->slug && !$this->exists()) {
                $this->slug = $this->str($name)->slug()->val();
            }

            return $name;
        });

        $this->attr('slug')->char()->setValidators('required,unique')->onSet(function ($slug) {
            if (!$slug) {
                return $this->slug;
            }

            return $this->str($slug)->slug()->val();
        })->setToArrayDefault();

        $this->attr('description')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('isAdminRole')->boolean()->setDefaultValue(false);
        $this->attr('users')->many2many('User2UserRole', 'UserRole', 'User')->setEntity(User::class);
        $this->attr('apiTokens')->many2many('ApiToken2UserRole', 'UserRole', 'ApiToken')->setEntity(ApiToken::class);
        $this->attr('permissions')->many2many('UserRole2UserPermission', 'UserRole', 'UserPermission')->setEntity(UserPermission::class)->onSet(function ($permissions) {
                // If not mongo Ids - load permissions by slugs
                if (is_array($permissions)) {
                    foreach ($permissions as $i => $perm) {
                        if (!$this->wDatabase()->isId($perm)) {
                            if (is_string($perm)) {
                                $permissions[$i] = UserPermission::findOne(['slug' => $perm]);
                            } elseif (isset($perm['id'])) {
                                $permissions[$i] = $perm['id'];
                            } elseif (isset($perm['slug'])) {
                                $permissions[$i] = UserPermission::findOne(['slug' => $perm['slug']]);
                            }
                        }
                    }
                }

                return $permissions;
            });
    }

    protected static function entityIndexes(IndexContainer $indexes)
    {
        parent::entityIndexes($indexes);

        $indexes->add(new CompoundIndex('unique', ['slug', 'deletedOn'], false, true));
    }

    /**
     * Check if this role has the requested $permission on given $item
     *
     * @param string $item
     * @param string $permission
     *
     * @return bool
     */
    public function checkPermission($item, $permission)
    {
        /* @var UserPermission $p */
        foreach ($this->permissions as $p) {
            if ($p->checkPermission($item, $permission)) {
                return true;
            }
        }

        return false;
    }
}