<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Entity\AbstractEntity;

/**
 * Class Setting
 *
 * @property string $id
 * @property string $key
 * @property object $settings
 *
 * @package Apps\Core\Php\Entities
 *
 */
class Setting extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'Settings';
    protected static $entityMask = '{key}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('key')->char()->setValidators('required,unique')->setToArrayDefault();
        $this->attr('settings')->object()->setToArrayDefault();

        $this->api('get', 'key/{key}', function ($key) {
            $record = $this->findOne(['key' => $key]);
            if (!$record) {
                $record = new self;
                $record->key = $key;
            }
            $record->id = $key;

            return $record->toArray('*');
        });

        $this->api('patch', 'key/{key}', function ($key) {
            $record = $this->findOne(['key' => $key]);
            $data = $this->wRequest()->getRequestData();
            if (empty($record)) {
                $record = new self();
                $record->key = $key;
            }
            $record->settings = $data['settings'];
            $record->save();

            $record->id = $key;

            return $record->toArray('*');
        });
    }

    /**
     * Load settings by key
     *
     * @param $key
     *
     * @return Setting|null
     */
    public static function load($key)
    {
        return static::findOne(['key' => $key]);
    }
}