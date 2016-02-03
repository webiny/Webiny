<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class UserGroup
 *
 * @property string           $name
 * @property string           $tag
 * @property ArrayObject      $permissions
 * @property EntityCollection $users
 *
 * @package Apps\Core\Php\Entities
 *
 */
class UserGroup extends EntityAbstract
{

    protected static $entityCollection = 'UserGroup';
    protected static $entityMask = '{name}';

    /**
     * This method is called during instantiation to build entity structure
     * @return void
     */
    protected function entityStructure()
    {
        $this->attr('name')->char()->setValidators('required');
        $this->attr('tag')->char()->setValidators('required')->onSet(function ($tag) {
            return $this->str($tag)->slug()->val();
        });
        $this->attr('users')->many2many('User2Group')->setEntity('\Apps\Core\Php\Entities\User');
        $this->attr('permissions')->object();
    }
}