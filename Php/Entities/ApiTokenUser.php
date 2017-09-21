<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Exceptions\AppException;

/**
 * Class ApiTokenUser
 */
class ApiTokenUser extends AbstractServiceUser
{
    protected static $isDiscoverable = false;
    protected static $classId = 'Webiny.Entities.ApiTokenUser';

    public function save()
    {
        if ($this->meta['apiToken'] === 'system') {
            throw new AppException('You are not allowed to use `system` as a token identifier for ApiTokenUser.');
        }

        if (!$this->exists()) {
            $host = $this->url($this->wConfig()->get('Application.WebPath'))->getHost();
            $this->email = $this->meta['apiToken'] . '@' . $host;
            $this->password = $this->crypt()->generateHardReadableString(30);
        }

        return parent::save();
    }

    /**
     * @return ApiToken|null
     */
    public function getApiToken()
    {
        return ApiToken::findById($this->meta['apiToken']);
    }

    public function getUserRoles()
    {
        return $this->getApiToken()->getUserRoles();
    }

    public function hasRole($name)
    {
        return $this->getApiToken()->hasRole($name);
    }
}