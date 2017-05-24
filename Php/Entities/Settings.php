<?php
namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\DevTools\Exceptions\AppException;
use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;
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

        $this->attr('key')->char()->setValidators('required,unique')->setToArrayDefault();
        $this->attr('settings')->object()->setToArrayDefault();

        $this->getApiMethods()->removeKey(['get', 'patch', 'post', 'delete']);
        /**
         * @api.name Get settings
         * @api.custom
         * @api.description Get settings
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
         * @api.name Update settings
         * @api.description Update settings
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
     * @return ArrayObject
     */
    public static function load()
    {
        /* @var $settings Settings */
        $settings = static::findOne(['key' => static::$key]);
        if ($settings && $settings->settings->count()) {
            return $settings->settings;
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