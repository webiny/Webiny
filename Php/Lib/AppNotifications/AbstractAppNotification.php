<?php

namespace Apps\Webiny\Php\Lib\AppNotifications;

use Apps\Webiny\Php\Entities\User;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\DateTimeObject\DateTimeObject;

/**
 * Class used to create app notification classes
 */
abstract class AbstractAppNotification
{
    use WebinyTrait, StdLibTrait;

    /**
     * @var User
     */
    protected $user = null;

    /**
     * @var array
     */
    protected $data = [];

    abstract public static function getTypeName();

    abstract public static function getTypeDescription();

    abstract public static function getTypeSlug();

    abstract public static function getTypeRoles();

    abstract public function getSubject();

    abstract public function getTemplate();

    /**
     * Get notification data
     *
     * @return array
     */
    public function getData()
    {
        return $this->data;
    }

    public function setData($data)
    {
        $this->data = $data;

        return $this;
    }

    public function getText()
    {
        $text = $this->str($this->getTemplate());

        foreach ($this->data as $k => $v) {
            $text->replace('{' . $k . '}', $v);
        }

        return $text->val();
    }

    public function setUser(User $user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @return DateTimeObject
     */
    public function getCreatedOn()
    {
        return $this->datetime();
    }
}