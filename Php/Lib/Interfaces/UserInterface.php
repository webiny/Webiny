<?php
namespace Apps\Webiny\Php\Lib\Interfaces;

use Webiny\Component\Entity\EntityCollection;

interface UserInterface
{
    /**
     * Get user's user roles
     *
     * @return EntityCollection|array
     */
    public function getUserRoles();

    /**
     * Check if user has a given role or one of the given roles
     *
     * @param string|string[] $name Role name or array of role names
     *
     * @return bool
     */
    public function hasRole($name);
}