<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\Authorization\AuthorizationTrait;
use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\Mongo\Index\SingleIndex;

/**
 * Class User
 *
 * @property string           $id
 * @property string           $fullName
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
    protected static $entityMask = '{fullName}';

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
        $this->attr('fullName')->char()->setValidators('required');
        $this->attr('password')->char()->onSet(function ($password) {
            if (!empty($password) && $this->wValidation()->password($password)) {
                return $this->wAuth()->createPasswordHash($password);
            }
        });
        $this->attr('enabled')->boolean()->setDefaultValue(true)->setValidators('required');
        $userGroup = '\Apps\Core\Php\Entities\UserGroup';
        $this->attr('groups')->many2many('User2Group')->setEntity($userGroup)->setValidators('minLength:1')->onSet(function ($groups) {
            // If not mongo Ids - load groups by tags
            if (is_array($groups)) {
                foreach ($groups as $i => $group) {
                    if (!$this->wDatabase()->isMongoId($group)) {
                        $groups[$i] = UserGroup::findOne(['tag' => $group]);
                    }
                }
            }

            return $groups;
        });
    }

    protected function entityApi()
    {
        /**
         * @api.name Login
         */
        $this->api('POST', 'login', function () {
            $data = $this->wRequest()->getRequestData();
            $authToken = $this->wAuth()->processLogin($data['username'])['authToken'];

            return [
                'authToken' => $authToken,
                'user'      => $this->wAuth()->getUser()->toArray($this->wRequest()->getFields('*,!password'))
            ];
        });

        /**
         * @api.name Get my profile
         */
        $this->api('GET', 'me', function () {
            return $this->wAuth()->getUser()->toArray($this->wRequest()->getFields('*,!password'));
        });

        /**
         * @api.name Update my profile
         */
        $this->api('PATCH', 'me', function () {
            $data = $this->wRequest()->getRequestData();
            $this->wAuth()->getUser()->populate($data)->save();

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