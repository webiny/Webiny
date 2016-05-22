<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;

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
class Setting extends EntityAbstract
{
    use DevToolsTrait;

    protected static $entityCollection = 'Settings';
    protected static $entityMask = '{key}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('key')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('settings')->object()->setToArrayDefault();

        $this->api('get', 'key/{key}', function ($key) {
            return $this->findOne(['key' => $key]);
        });
    }

    public function save()
    {
        // if the key already exists, we need to update the record
        $result = $this->findOne(['key' => $this->key]);
        if (!empty($result)) {
            $result->settings = $this->settings;
            $result->save();

            return true;
        } else {
            return parent::save();
        }
    }

}