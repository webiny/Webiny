<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\Mongo\Index\SingleIndex;

/**
 * Class User
 *
 * @property string $firstName
 * @property string $lastName
 * @property string $email
 * @property string $password
 * @property EntityCollection $groups
 * @property bool   $enabled
 *
 * @package Ht\Entities
 *
 */
class User extends EntityAbstract
{

    protected static $entityCollection = 'Users';
    protected static $entityMask = '{firstName} {lastName}';

    protected static function entityIndexes()
    {
        return [
            new SingleIndex('email', 'email', false, true)
        ];
    }

    /**
     * This method is called during instantiation to build entity structure
     * @return void
     */
    protected function entityStructure()
    {
        $this->attr('email')->char()->setValidators('required,email,unique');
        $this->attr('firstName')->char()->setValidators('required');
        $this->attr('lastName')->char()->setValidators('required');
        $this->attr('password')->char()->setValidators('password');
        $this->attr('enabled')->boolean()->setDefaultValue(true)->setValidators('required');
        $this->attr('groups')->many2many('User2Group')->setEntity('\Apps\Core\Php\Entities\UserGroup')->setValidators('minLength:1');
    }

    public function canCreate($entity)
    {
        return $this->checkPermission($entity, 'c');
    }

    public function canRead($entity)
    {
        return $this->checkPermission($entity, 'r');
    }

    public function canUpdate($entity)
    {
        return $this->checkPermission($entity, 'u');
    }

    public function canDelete($entity)
    {
        return $this->checkPermission($entity, 'd');
    }

    public function canExecute($entity, $method = null)
    {
        return $this->checkPermission($entity, $method);
    }

    private function checkPermission($entity, $permission)
    {
        /* @var $group UserGroup */
        foreach($this->groups as $group){
            if($group->checkPermission($entity, $permission)){
                return true;
            }
        }

        return false;
    }
}