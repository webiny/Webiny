<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Dispatchers;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Webiny\Component\Mongo\MongoTrait;
use Webiny\Component\StdLib\StdLibTrait;

abstract class AbstractFlow
{
    use DevToolsTrait, StdLibTrait, MongoTrait;

    abstract public function canHandle($httpMethod, $params);

    abstract public function handle(EntityAbstract $entity, $params);
}