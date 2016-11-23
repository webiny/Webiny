<?php
namespace Apps\Core\Php\DevTools\Authorization;

use Apps\Core\Php\Entities\UserRole;
use Webiny\Component\Entity\AbstractEntity;

/**
 * Class SystemUser
 *
 * This class is used only when request contains a valid ACL System Token.
 * It is necessary for things like Cron - when we work with system entities and may have filters based on roles.
 * SystemUser has all the roles present in the system so it will pass all ACL.
 *
 * It is not possible to use this class in any way except by having a valid System API token in your headers.
 *
 * @package Apps\Core\Php\DevTools\Authorization
 */
class SystemUser extends AbstractEntity
{
    /**
     * @var null|AbstractEntity
     */
    private $user = null;

    public function __construct(AbstractEntity $user)
    {
        parent::__construct();
        $this->user = $user;

        $this->user->attr('roles')->dynamic(function () {
            return UserRole::find();
        });
    }

    function __call($name, $arguments)
    {
        return $this->user->__call($name, $arguments);
    }

    public function __get($name)
    {
        return $this->user->__get($name);
    }

    public static function find(array $conditions = [], array $order = [], $limit = 0, $page = 0, $includeDeleted = false)
    {
        return null;
    }

    public static function findOne(array $conditions = [], $includeDeleted = false)
    {
        return null;
    }

    public static function findById($id, $includeDeleted = false)
    {
        return null;
    }

    public function populate($data)
    {
        return $this;
    }

    public function delete($permanent = false)
    {
        return true;
    }

    public function save()
    {
        return true;
    }
}