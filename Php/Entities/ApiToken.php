<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Apps\Webiny\Php\Lib\Interfaces\UserInterface;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Webiny\Component\Crypt\CryptTrait;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\Mongo\Index\SingleIndex;
use Webiny\Component\StdLib\StdObject\DateTimeObject\DateTimeObject;

/**
 * Class ApiToken
 *
 * @property string           $id
 * @property string           $token
 * @property string           $owner
 * @property boolean          $logRequests
 * @property integer          $requests
 * @property DateTimeObject   $lastActivity
 * @property EntityCollection $roles
 *
 * @package Apps\Webiny\Php\Entities
 */
class ApiToken extends AbstractEntity implements UserInterface
{
    use WebinyTrait, CryptTrait;

    protected static $entityCollection = 'ApiTokens';
    protected static $entityMask = '{id}';

    public function __construct()
    {
        parent::__construct();
        $this->attr('token')->char()->setSkipOnPopulate()->onToDb(function ($value) {
            if (!$value) {
                $value = $this->crypt()->generateUserReadableString(40);
            }

            return $value;
        })->setToArrayDefault();
        $this->attr('owner')->char()->setToArrayDefault();
        $this->attr('description')->char()->setToArrayDefault();
        $this->attr('lastActivity')->datetime()->setToArrayDefault();
        $this->attr('logRequests')->boolean()->setDefaultValue(false)->setToArrayDefault();
        $this->attr('requests')->integer()->setToArrayDefault()->setDefaultValue(0);
        $this->attr('enabled')->boolean()->setDefaultValue(true)->setToArrayDefault();
        $userRole = '\Apps\Webiny\Php\Entities\UserRole';
        $this->attr('roles')->many2many('ApiToken2UserRole')->setEntity($userRole)->onSet(function ($roles) {
            // If not mongo Ids - load roles by slugs
            if (is_array($roles)) {
                foreach ($roles as $i => $role) {
                    if (!$this->wDatabase()->isId($role)) {
                        if (is_string($role)) {
                            $roles[$i] = UserRole::findOne(['slug' => $role]);
                        } elseif (isset($role['id'])) {
                            $roles[$i] = $role['id'];
                        } elseif (isset($role['slug'])) {
                            $roles[$i] = UserRole::findOne(['slug' => $role['slug']]);
                        }
                    }
                }
            }

            return $roles;
        });
    }

    protected static function entityIndexes(IndexContainer $indexes)
    {
        parent::entityIndexes($indexes);

        $indexes->add(new SingleIndex('token', 'token'));
    }


    public function getUserRoles()
    {
        return $this->roles;
    }

    public function hasRole($name)
    {
        foreach ($this->getUserRoles() as $role) {
            if ($role->slug == $name) {
                return true;
            }
        }

        return false;
    }
}