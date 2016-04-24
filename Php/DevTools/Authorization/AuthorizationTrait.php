<?php
namespace Apps\Core\Php\DevTools\Authorization;

use Apps\Core\Php\Entities\User;
use Apps\Core\Php\Entities\UserGroup;
use Webiny\Component\Entity\EntityCollection;

/**
 * Trait AuthorizationTrait
 */
trait AuthorizationTrait
{
    /**
     * @return User
     */
    protected abstract function getUserToAuthorize();

    /**
     * @return EntityCollection
     */
    protected abstract function getUserGroups();

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
        if(!$this->wConfig()->get('Application.EntityDispatcher.CheckUserPermissions', true)){
            return true;
        }

        if (!is_string($class)) {
            $class = get_class($class);
        } else {
            $class = trim($class, '\\');
        }

        $user = $this->getUserToAuthorize();
        $groups = [UserGroup::findOne(['tag' => 'public'])];
        if ($user) {
            foreach ($user->getUserGroups() as $group) {
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