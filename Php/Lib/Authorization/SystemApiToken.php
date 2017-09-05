<?php
namespace Apps\Webiny\Php\Lib\Authorization;

use Apps\Webiny\Php\Lib\Interfaces\UserInterface;
use Apps\Webiny\Php\Entities\UserRole;
use Webiny\Component\Entity\EntityCollection;

/**
 * Class SystemApiToken
 *
 * This class will be used bt Authorization when requests are made with Application.Acl.Token.
 */
class SystemApiToken implements UserInterface
{
    function __toString()
    {
        return 'null';
    }

    public function exists()
    {
        return true;
    }

    public function save()
    {
        return true;
    }

    /**
     * @var null|EntityCollection
     */
    private $roles = null;

    public function getUserRoles()
    {
        if (!$this->roles) {
            $this->roles = UserRole::find();
        }

        return $this->roles;
    }

    public function hasRole($name)
    {
        return true;
    }
}