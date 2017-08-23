<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\DevTools\Api\ApiContainer;
use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;
use Apps\Webiny\Php\DevTools\Entity\EntityQuery\EntityQuery;
use Apps\Webiny\Php\DevTools\Entity\EntityQuery\Filter;
use Apps\Webiny\Php\DevTools\Entity\EntityQuery\QueryContainer;
use Apps\Webiny\Php\DevTools\Entity\Indexes\IndexContainer;
use Webiny\Component\Mongo\Index\CompoundIndex;
use Webiny\Component\Mongo\Index\SingleIndex;

/**
 * Class ApiLog
 *
 * @property string         $id Log ID
 * @property string         $method HTTP method
 * @property string         $token Token ID or 'system' if request was made using system API token
 * @property AbstractEntity $user User that made the request
 * @property array          $request Request details
 *
 * @package Apps\Webiny\Php\Entities
 *
 */
class ApiLog extends AbstractEntity
{
    protected static $entityCollection = 'ApiLogs';
    protected static $entityMask = '{id}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('token')->char()->onSet(function ($value) {
            if ($value instanceof AbstractEntity) {
                return $value->id;
            }

            return $value;
        })->onGet(function ($value) {
            if ($this->wDatabase()->isId($value)) {
                return ApiToken::findById($value);
            }

            return $value;
        })->onToDb(function ($value) {
            if ($value instanceof AbstractEntity) {
                return $value->id;
            }

            return $value;
        });
        $this->attr('user')->many2one()->setEntity($this->wAuth()->getUserClass());
        $this->attr('request')->object()->setToArrayDefault();
        $this->attr('method')->char()->setToArrayDefault();

        $this->attributes->removeKey('modifiedOn');
    }

    protected function entityApi(ApiContainer $api)
    {
        parent::entityApi($api);

        /**
         * @api.name Get distinct HTTP methods of all api logs
         * @api.description Returns a list of unique HTTP methods that are present in the database
         */
        $api->get('/methods', function () {
            return $this->wDatabase()->distinct(static::$entityCollection, 'request.method');
        });
    }

    protected static function entityIndexes(IndexContainer $indexes)
    {
        parent::entityIndexes($indexes);

        $indexes->add(new SingleIndex('token', 'token'));
        $indexes->add(new SingleIndex('user', 'user'));
        $indexes->add(new SingleIndex('method', 'method'));
        $indexes->add(new SingleIndex('createdOn', 'createdOn', false, false, false, 604800)); // expire after 7 days
        $indexes->add(new CompoundIndex('methodUrl', ['request.url', 'request.method']));
    }

    protected static function entityQuery(QueryContainer $query)
    {
        parent::entityQuery($query);

        $query->add(new Filter('*', function (EntityQuery $query) {
            $user = self::wAuth()->getUser();
            if (!$user) {
                return $query->abort();
            }

            if (!$user->hasRole('webiny-acl-api-token-manager')) {
                $query->setCondition('token', ['$ne' => 'system']);
            }
        }));
    }
}