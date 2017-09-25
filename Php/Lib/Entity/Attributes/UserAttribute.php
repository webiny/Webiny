<?php

namespace Apps\Webiny\Php\Lib\Entity\Attributes;

use Apps\Webiny\Php\Entities\User;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\Entity\Attribute\Many2OneAttribute;

/**
 * User attribute
 */
class UserAttribute extends Many2OneAttribute
{
    use WebinyTrait;

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        parent::__construct();
        $this->setEntity(User::class);
    }

    public function getValue($params = [], $processCallbacks = true)
    {
        return parent::getValue($params, $processCallbacks);
    }


    protected function loadEntity($id)
    {
        if (!$id) {
            return null;
        }

        $user = $this->wUser()->byId($id);

        if ($user) {
            $this->setEntity(get_class($user));
        }

        return $user;
    }
}