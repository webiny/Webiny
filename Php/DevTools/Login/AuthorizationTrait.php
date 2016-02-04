<?php
namespace Apps\Core\Php\DevTools\Login;

use Apps\Core\Php\Entities\User;
use Apps\Core\Php\Entities\UserGroup;

/**
 * Trait AuthorizationTrait
 */
trait AuthorizationTrait
{
    /**
     * @return User
     */
    protected abstract function getUserToAuthorize();

    public function canCreate($class)
    {
        return $this->checkPermission($class, 'create');
    }

    public function canRead($class)
    {
        return $this->checkPermission($class, 'read');
    }

    public function canUpdate($class)
    {
        return $this->checkPermission($class, 'update');
    }

    public function canDelete($class)
    {
        return $this->checkPermission($class, 'delete');
    }

    public function canExecute($class, $method = null)
    {
        return $this->checkPermission($class, $method);
    }

    private function checkPermission($class, $permission)
    {
        if (!is_string($class)) {
            $class = get_class($class);
        } else {
            $class = trim($class, '\\');
        }

        $user = $this->getUserToAuthorize();
        $groups = [UserGroup::findOne(['tag' => 'anonymous'])];
        if ($user) {
            foreach ($user->groups as $group) {
                $groups[] = $group;
            }
        }

        /* @var $group UserGroup */
        foreach ($groups as $group) {
            if ($group->checkPermission($class, $permission)) {
                return true;
            }
        }

        return false;
    }


}