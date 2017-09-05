<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Dispatchers\Flows;

use Apps\Webiny\Php\Lib\WebinyTrait;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Webiny\Component\Mongo\MongoTrait;
use Webiny\Component\StdLib\StdLibTrait;

abstract class AbstractFlow
{
    use WebinyTrait, StdLibTrait, MongoTrait;

    abstract public function canHandle($httpMethod, $params);

    abstract public function handle(AbstractEntity $entity, $params);

    public function getPriority()
    {
        return 100;
    }
}