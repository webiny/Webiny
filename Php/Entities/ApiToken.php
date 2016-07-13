<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Webiny\Component\Crypt\CryptTrait;
use Webiny\Component\Entity\EntityException;
use Webiny\Component\Mongo\Index\SingleIndex;

/**
 * Class ApiToken
 *
 * @property string $id
 * @property string $token
 * @property string $owner
 *
 * @package Apps\Core\Php\Entities
 *
 */
class ApiToken extends AbstractEntity
{
    use DevToolsTrait, CryptTrait;

    protected static $entityCollection = 'ApiTokens';
    protected static $entityMask = '{id}';

    protected static function entityIndexes()
    {
        return [
            new SingleIndex('token', 'token')
        ];
    }


    public function __construct()
    {
        parent::__construct();

        $this->attr('token')->char()->setSkipOnPopulate()->onToDb(function ($value) {
            if (!$value) {
                $value = $this->crypt()->generateUserReadableString(40);
            }

            return $value;
        })->setToArrayDefault();
        $this->attr('owner')->char()->setToArrayDefault();
        $this->attr('description')->char()->setToArrayDefault();
        $this->attr('lastActivity')->datetime()->setToArrayDefault();
        $this->attr('enabled')->boolean()->setDefaultValue(true)->setToArrayDefault();
    }
}