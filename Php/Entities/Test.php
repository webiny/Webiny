<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Interfaces\PublicApiInterface;

/**
 * Class Test
 *
 */
class Test extends AbstractEntity
{
    protected static $classId = 'Webiny.Entities.Test';
    protected static $collection = 'Test';

    public function __construct()
    {
        parent::__construct();

        $this->attr('test')->char();
    }

    protected function entityApi(ApiContainer $api)
    {
        parent::entityApi($api);

        $api->get('/')->setPublic();
        $api->get('{id}')->setPublic();
        $api->post('/')->setPublic();
        $api->patch('{id}')->setPublic();
    }

    public static function findById($id, $options = [])
    {
        $inst = parent::findById($id, $options);
        $creator = $inst->createdBy;

        return $inst;
    }


}