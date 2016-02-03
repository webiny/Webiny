<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\Mongo\Index\SingleIndex;

/**
 * Class User
 *
 * @property string           $firstName
 * @property string           $lastName
 * @property string           $email
 * @property string           $password
 * @property EntityCollection $groups
 * @property bool             $enabled
 *
 * @package Apps\Core\Php\Entities
 *
 */
class User extends EntityAbstract
{
    use DevToolsTrait;

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
        $this->attr('password')->char()->onSet(function ($password) {
            if (!empty($password) && $this->wValidation()->password($password)) {
                return $this->wLogin()->createPasswordHash($password);
            }
        });
        $this->attr('enabled')->boolean()->setDefaultValue(true)->setValidators('required');
        $this->attr('groups')->many2many('User2Group')->setEntity('\Apps\Core\Php\Entities\UserGroup')->setValidators('minLength:1');
    }
}