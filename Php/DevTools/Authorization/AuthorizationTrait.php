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
     * @return EntityCollection|array
     */
    public abstract function getUserGroups();

    /**
     * @return User
     */
    protected abstract function getUserToAuthorize();

    public function canCreate($class)
    {
        return $this->checkPermission($class, 'crudCreate');
    }

    public function canRead($class)
    {
        return $this->checkPermission($class, 'crudRead');
    }

    public function canUpdate($class)
    {
        return $this->checkPermission($class, 'crudUpdate');
    }

    public function canDelete($class)
    {
        return $this->checkPermission($class, 'crudDelete');
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