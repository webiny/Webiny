<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\I18N\I18NLocales;
use Webiny\Component\Entity\Attribute\Validation\ValidationException;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class I18NLocale
 *
 * @package Apps\Selecto\Php\Entities
 *
 * @property bool        $enabled
 * @property bool        $default
 * @property string      $key
 * @property string      $label
 * @property string      $cacheKey
 * @property ArrayObject $formats
 */
class I18NLocale extends AbstractEntity
{
    protected static $collection = 'I18NLocales';
    protected static $classId = 'Webiny.Entities.I18NLocale';

    public function __construct()
    {
        parent::__construct();

        $this->attr('enabled')->boolean();

        /**
         * Default locale that will be used when locale detection (executed on client-side) failed.
         * Only one locale can be set as default. Default locale cannot be deleted.
         */
        $this->attr('default')->boolean()->onSet(function ($value) {
            if ($value !== $this->default) {
                if ($value) {
                    $oldDefaultLocale = I18NLocale::findOne(['default' => true]);
                    if ($oldDefaultLocale) {
                        /* @var I18NLocale $oldDefaultLocale */
                        $this->onAfterSave(function () use ($oldDefaultLocale) {
                            $oldDefaultLocale->default = false;
                            $oldDefaultLocale->save();
                        }, true);
                    }
                }
            }

            return $value;
        });

        $this->attr('key')->char()->setValidators(function ($value) {
            if (!I18NLocales::isValidLocale($value)) {
                throw new ValidationException('You must select a valid locale.');
            }
        })->setToArrayDefault();

        $this->attr('label')->dynamic(function () {
            return I18NLocales::getLabel($this->key);
        });

        $this->attr('formats')->object()->setDefaultValue([
            'date'     => '',
            'time'     => '',
            'datetime' => '',
            'money'    => [
                'symbol'    => '',
                'format'    => '',
                'decimal'   => '',
                'thousand'  => '',
                'precision' => 2
            ],
            'number'   => [
                'decimal'   => '',
                'thousand'  => '',
                'precision' => 2
            ]
        ]);

        /**
         * Cache key for current locale, changes whenever a locale, text or a translation changes.
         */
        $this->attr('cacheKey')->char()->setSkipOnPopulate()->setToArrayDefault();

        /**
         * If this is the first locale created, set it as default immediately.
         */
        $this->onBeforeCreate(function () {
            $this->updateCacheKey();
            if (I18NLocale::count() === 0) {
                $this->default = true;
            }
        });
    }

    protected function entityApi(ApiContainer $api)
    {
        parent::entityApi($api);

        /**
         * @api.name        List all locales
         * @api.description Lists all locales, excludes ones that were already added.
         */
        $api->get('locales', function () {
            return I18NLocales::getLocales();
        });

        /**
         * @api.name        List available locales
         * @api.description Lists locales that were not already added.
         */
        $api->get('/available', function () {
            $params = ['I18NLocales', ['deletedOn' => null], [], 0, 0, ['projection' => ['_id' => 0, 'key' => 1]]];
            $exclude = $this->wDatabase()->find(...$params);
            $exclude = array_map(function ($item) {
                return $item['key'];
            }, $exclude);

            return I18NLocales::getLocales($exclude);
        });

        /**
         * @api.name        List available locales
         * @api.description Lists all locales, excludes ones that were already added.
         */
        $api->get('/available/{locale}', function (I18NLocale $locale) {
            $params = [
                'I18NLocales',
                ['deletedOn' => null, 'id' => ['$ne' => $locale->id]],
                [],
                0,
                0,
                ['projection' => ['_id' => 0, 'key' => 1]]
            ];
            $exclude = $this->wDatabase()->find(...$params);
            $exclude = array_map(function ($item) {
                return $item['key'];
            }, $exclude);

            return I18NLocales::getLocales($exclude);
        });

    }

    /**
     * Returns locale by key (eg. "en-GB").
     * @param $locale
     *
     * @return I18NLocale|null
     */
    public static function findByKey($locale)
    {
        return self::findOne(['key' => $locale]);
    }

    /**
     * Returns locale that was set as default.
     * @return I18NLocale|null
     */
    public static function findDefault()
    {
        return self::findOne(['enabled' => true, 'default' => true]);
    }

    /**
     * Updates cache key for current locale. Updated when translations, text or locale settings were changed. Used
     * on client-side, to determine whether or not new fetch of translations is needed.
     * @return $this
     */
    public function updateCacheKey()
    {
        $this->cacheKey = uniqid();

        return $this;
    }
}