<?php
namespace Apps\Core\Php\DevTools\Interfaces;

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
     * Check if user has a given role
     *
     * @param $name
     *
     * @return bool
     */
    public function hasRole($name);
}