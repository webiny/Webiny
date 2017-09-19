<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\I18N\I18NLocales;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\Entity\Attribute\Validation\ValidationException;

/**
 * Class I18NLocale
 *
 * @package Apps\Selecto\Php\Entities
 *
 * @property bool   $enabled
 * @property string $key
 * @property string $label
 * @property string $cacheKey
 */
class I18NLocale extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'I18NLocales';
    protected static $classId = 'Webiny.Entities.I18NLocale';

    public function __construct()
    {
        parent::__construct();

        $this->attr('enabled')->boolean();
        $this->attr('key')->char()->setValidators(function ($value) {
            if (!I18NLocales::isValidLocale($value)) {
                throw new ValidationException('You must select a valid locale.');
            }
        })->setToArrayDefault();

        $this->attr('label')->dynamic(function () {
            return I18NLocales::getLabel($this->key);
        });

        $this->attr('cacheKey')->char()->setSkipOnPopulate()->setToArrayDefault();
    }

    protected function entityApi(ApiContainer $api)
    {
        parent::entityApi($api);

        /**
         * @api.name        List locales
         * @api.description Lists all available locales.
         */
        $api->get('locales', function () {
            return I18NLocales::getLocales();
        });

        /**
         * @api.name        List available locales
         * @api.description Lists locales that were not already added.
         */
        $api->get('/available', function () {
            $params = ['I18NLanguages', ['deletedOn' => null], [], 0, 0, ['projection' => ['_id' => 0, 'locale' => 1]]];
            $exclude = $this->wDatabase()->find(...$params);
            $exclude = array_map(function ($item) {
                return $item['locale'];
            }, $exclude);

            return I18NLocales::getLocales($exclude);
        });
    }

    /**
     * @param $locale
     *
     * @return I18NLocale|null
     */
    public static function findByKey($locale)
    {
        return self::findOne(['key' => $locale]);
    }

    /**
     * @return $this
     */
    public function updateCacheKey()
    {
        $this->cacheKey = uniqid();

        return $this;
    }
}