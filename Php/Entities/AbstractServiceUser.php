<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Api\ApiContainer;

/**
 * Abstract Class AbstractServiceUser
 * All non-human user classes must use this class as their base class
 */
abstract class AbstractServiceUser extends User
{
    protected static $isDiscoverable = false;

    public function __construct()
    {
        parent::__construct();

        $this->getAttribute('type')->setDefaultValue('service');
    }

    protected function entityApi(ApiContainer $api)
    {
        parent::entityApi($api);
    }
}