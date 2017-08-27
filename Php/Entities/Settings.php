<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\DevTools\Exceptions\AppException;
use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;
use Webiny\Component\Mongo\Index\SingleIndex;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class Settings
 *
 * @property string $id
 * @property string $key
 * @property object $settings
 *
 * @package Apps\Webiny\Php\Entities
 *
 */
class Settings extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'Settings';
    protected static $entityMask = '{key}';
    protected static $key = null;

    public function __construct()
    {
        parent::__construct();

        $this->index(new SingleIndex('key', 'key', false, true));

        $this->attr('key')->char()->setValidators('required,unique')->setToArrayDefault();
        $this->attr('settings')->object()->setToArrayDefault();

        array_map(function ($method) {
            unset($this->apiMethods[$method]);
        }, ['get', 'patch', 'post', 'delete']);

        /**
         * @api.name        Get settings
         * @api.description Gets settings data of this Settings entity.
         */
        $this->api('GET', '/', function () {
            if (!static::$key) {
                throw new AppException('You must specify a settings key for ' . get_called_class());
            }

            $record = $this->findOne(['key' => static::$key]);
            if (!$record) {
                $record = new self;
                $record->key = static::$key;
            }

            return $record->settings->val();
        });

        /**
         * @api.name        Update settings
         * @api.description Updates settings for this Settings entity.
         */
        $this->api('PATCH', '/', function () {
            if (!static::$key) {
                throw new AppException('You must specify a settings key for ' . get_called_class());
            }
            $record = $this->findOne(['key' => static::$key]);
            if (empty($record)) {
                $record = new self();
                $record->key = static::$key;
            }
            $record->settings = $this->wRequest()->getRequestData();
            $record->save();

            return $record->settings->val();
        });
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
        if ($settings && $settings->settings->count()) {
            return $returnEntity ? $settings : $settings->settings;
        }

        return null;
    }

    /**
     * Update settings
     *
     * @param array|ArrayObject $settings
     *
     * @return Settings|null
     */
    public static function update($settings)
    {
        /* @var $entity Settings */
        $entity = static::findOne(['key' => static::$key]);
        if ($entity) {
            $entity->settings = $settings;
            $entity->save();
        }
    }
}