<?php
namespace Apps\Core\Php\DevTools\Interfaces;

use Webiny\Component\Entity\EntityCollection;

interface UserInterface
{
    /**
     * Get user's user groups
     *
     * @return EntityCollection|array
     */
    public function getUserGroups();
}