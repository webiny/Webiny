<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Webiny\Component\Mongo\Index\SingleIndex;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class Settings
 *
 * @property string $id
 * @property string $key
 * @property object $settings
 */
abstract class AbstractSettings extends AbstractEntity
{
    protected static $classId = null;
    protected static $collection = 'Settings';
    protected static $mask = '{key}';
    protected static $key = null;

    public function __construct()
    {
        parent::__construct();

        $this->attr('key')->char()->setValidators('required,unique')->setToArrayDefault();
        $this->attr('settings')->object()->setToArrayDefault();
    }

    /**
     * Load settings
     *
     * @param bool $returnEntity Return settings instance (Default: false)
     *
     * @return $this|ArrayObject
     */
    public static function load($returnEntity = false)
    {
        /* @var $settings $this */
        $settings = static::findOne(['key' => static::$key]);
        if (!$settings) {
            $settings = new static;
            $settings->key = static::$key;
            $settings->save();
        }

        if ($settings) {
            return $returnEntity ? $settings : $settings->settings;
        }

        return null;
    }

    /**
     * Update settings
     *
     * @param array|ArrayObject $settings
     *
     * @return AbstractSettings|null
     */
    public static function update($settings)
    {
        /* @var $entity AbstractSettings */
        $entity = static::findOne(['key' => static::$key]);
        if ($entity) {
            $entity->settings = $settings;
            $entity->save();
        }
    }

    protected static function entityIndexes(IndexContainer $indexes)
    {
        parent::entityIndexes($indexes);
        $indexes->add(new SingleIndex('key', 'key', false, true));
    }

    protected function entityApi(ApiContainer $api)
    {
        /**
         * @api.name        Get settings
         * @api.description Gets settings data of this Settings entity.
         */
        $api->get('/', function () {
            if (!static::$key) {
                throw new AppException('You must specify a settings key for ' . get_called_class());
            }

            $record = $this->findOne(['key' => static::$key]);
            if (!$record) {
                $record = new static;
                $record->key = static::$key;
            }

            return $record->settings->val();
        });

        /**
         * @api.name        Update settings
         * @api.description Updates settings for this Settings entity.
         */
        $api->patch('/', function () {
            if (!static::$key) {
                throw new AppException('You must specify a settings key for ' . get_called_class());
            }
            $record = $this->findOne(['key' => static::$key]);
            if (empty($record)) {
                $record = new static();
                $record->key = static::$key;
            }
            $record->settings = $this->wRequest()->getRequestData();
            $record->save();

            return $record->settings->val();
        });
    }
}