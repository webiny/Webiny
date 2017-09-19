<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\Mongo\Index\CompoundIndex;

/**
 * Class UserRoleGroup
 *
 * @property string           $name
 * @property string           $description
 * @property string           $slug
 * @property EntityCollection $roles
 * @property EntityCollection $users
 * @property EntityCollection $apiTokens
 */
class UserRoleGroup extends AbstractEntity
{
    protected static $classId = 'Webiny.Entities.UserRoleGroup';
    protected static $entityCollection = 'UserRoleGroups';
    protected static $entityMask = '{name}';

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
        $this->attr('users')->many2many('User2UserRoleGroup')->setEntity(User::class);
        $this->attr('apiTokens')->many2many('ApiToken2UserRoleGroup')->setEntity(ApiToken::class);
        $this->attr('roles')->many2many('UserRole2UserRoleGroup')->setEntity(UserRole::class)->onSet(function ($roles) {
            // If not mongo Ids - load roles by slugs
            if (is_array($roles)) {
                foreach ($roles as $i => $role) {
                    if (!$this->wDatabase()->isId($role)) {
                        if (is_string($role)) {
                            $roles[$i] = UserRole::findOne(['slug' => $role]);
                        } elseif (isset($role['id'])) {
                            $roles[$i] = $role['id'];
                        } elseif (isset($role['slug'])) {
                            $roles[$i] = UserRole::findOne(['slug' => $role['slug']]);
                        }
                    }
                }
            }

            return $roles;
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