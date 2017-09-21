<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Webiny\Component\Entity\EntityCollection;

/**
 * Class SystemApiTokenUser
 */
final class SystemApiTokenUser extends AbstractServiceUser
{
    protected static $classId = 'Webiny.Entities.SystemApiTokenUser';

    /**
     * @var null|EntityCollection
     */
    private $roles = null;

    public function save()
    {
        // Check if another system user already exists
        $systemUser = $this->wDatabase()->findOne(User::getCollection(), ['meta.apiToken' => 'system', 'deletedOn' => null]);
        if ($systemUser) {
            throw new AppException('Only one SystemApiTokenUser is allowed in the system!', 'WBY-SYSTEM-USER-EXISTS');
        }

        if (!$this->exists()) {
            $host = $this->url($this->wConfig()->get('Application.WebPath'))->getHost();
            $this->meta['apiToken'] = 'system';
            $this->email = $this->meta['apiToken'] . '@' . $host;
            $this->password = $this->crypt()->generateHardReadableString(30);

            return parent::save();
        }

        return true;
    }

    public function getUserRoles()
    {
        if (!$this->roles) {
            $this->roles = UserRole::find([], [], 0, 0, ['entityFilters' => false]);
        }

        return $this->roles;
    }

    public function hasRole($name)
    {
        return true;
    }
}