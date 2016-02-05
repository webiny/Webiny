<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Apps\Core\Php\DevTools\Login\AuthorizationTrait;
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
    use DevToolsTrait, AuthorizationTrait;

    protected static $entityCollection = 'Users';
    protected static $entityMask = '{firstName} {lastName}';

    protected static function entityIndexes()
    {
        return [
            new SingleIndex('email', 'email', false, true)
        ];
    }

    /**
     * Get user instance for authorization
     * @return $this
     */
    protected function getUserToAuthorize()
    {
        return $this;
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
                return $this->wAuth()->createPasswordHash($password);
            }
        });
        $this->attr('enabled')->boolean()->setDefaultValue(true)->setValidators('required');
        $userGroup = '\Apps\Core\Php\Entities\UserGroup';
        $this->attr('groups')->many2many('User2Group')->setEntity($userGroup)->setValidators('minLength:1')->onSet(function ($groups) {
            // If not mongo Ids - load groups by tags
            if(is_array($groups)){
                foreach($groups as $i => $group){
                    if(!$this->wDatabase()->isMongoId($group)){
                        $groups[$i] = UserGroup::findOne(['tag' => $group]);
                    }
                }
            }

            return $groups;
        });
    }

    protected function entityApi()
    {
        // POST /entities/core/users/login
        $this->api('POST', 'login', function () {
            $data = $this->wRequest()->getRequestData();
            $authToken = $this->wAuth()->processLogin($data['username'])['authToken'];

            return [
                'authToken' => $authToken,
                'user'      => $this->wAuth()->getUser()->toArray($this->wRequest()->getFields('*,!password'))
            ];
        });

        // GET /entities/core/users/me
        $this->api('GET', 'me', function () {
            return $this->wAuth()->getUser()->toArray($this->wRequest()->getFields('*,!password'));
        });
    }


    public function save()
    {
        $new = !$this->exists();
        $res = parent::save();
        if ($new) {
            $this->wAuth()->getLogin()->setUserAccountConfirmationStatus($this->email);
        }

        return $res;
    }
}