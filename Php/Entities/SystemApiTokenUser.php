<?php

namespace Apps\Webiny\Php\Entities;

use Webiny\Component\Entity\EntityCollection;

/**
 * Class SystemApiTokenUser
 * This class represents the user of System token.
 * Whenever a request is made using system api token, this user will be returned as current user.
 */
final class SystemApiTokenUser extends AbstractServiceUser
{
    protected static $classId = 'Webiny.Entities.SystemApiTokenUser';
    protected static $i18nNamespace = 'Webiny.Entities.SystemApiTokenUser';

    /**
     * @var null|EntityCollection
     */
    private $roles = null;

    /**
     * Get SystemApiTokenUser
     *
     * @return SystemApiTokenUser|\Apps\Webiny\Php\Lib\Entity\AbstractEntity|null
     */
    public static function load()
    {
        return static::findOne(['meta.apiToken' => 'system']);
    }

    public function populate($data)
    {
        if (!$this->isDbData($data)) {
            return $this;
        }

        return parent::populate($data);
    }

    public function save()
    {
        // Check if another system user already exists
        $systemUser = $this->wDatabase()->findOne(User::getCollection(), ['meta.apiToken' => 'system', 'deletedOn' => null]);
        if (!$this->exists() && !$systemUser) {
            $host = $this->url($this->wConfig()->get('Webiny.WebUrl'))->getHost();
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