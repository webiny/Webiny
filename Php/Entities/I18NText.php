<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Entity\EntityQuery\EntityQuery;
use Apps\Webiny\Php\Lib\Entity\EntityQuery\Filter;
use Apps\Webiny\Php\Lib\Entity\EntityQuery\QueryContainer;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\I18N\Exports\TextsExport;
use Apps\Webiny\Php\Lib\I18N\Exports\TranslationsExport;
use Apps\Webiny\Php\Lib\I18N\I18N;
use Apps\Webiny\Php\Lib\I18N\I18NLocales;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class I18NText
 * @property string        $key
 * @property string        $app
 * @property string        $base
 * @property ArrayObject   $translations
 * @property I18NTextGroup $group
 */
class I18NText extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'I18NTexts';
    protected static $i18nNamespace = 'Webiny.Entities.I18NText';
    protected static $classId = 'Webiny.Entities.I18NText';

    protected static function entityQuery(QueryContainer $query)
    {
        $query->add(new Filter('edited', function (EntityQuery $query, $flag) {
            $query->removeCondition('edited');
            $flag = filter_var($flag, FILTER_VALIDATE_BOOLEAN);

            if ($flag) {
                $query->setConditions([
                    '$and' => [
                        ['translations.en_GB' => ['$exists' => true]],
                        ['translations.en_GB' => ['$nin' => [null, ""]]],
                    ]
                ]);
            } else {
                $query->setConditions([
                    '$or' => [
                        ['translations.en_GB' => ['$exists' => false]],
                        ['translations.en_GB' => ['$in' => [null, ""]]],
                    ]
                ]);
            }
        }));
    }

    public function __construct()
    {
        parent::__construct();

        $this->attr('app')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('key')->char()->setValidators('required,unique')->setToArrayDefault();
        $this->attr('base')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('group')->many2one()->setEntity(I18NTextGroup::class);
        $this->attr('translations')->arr()->setToArrayDefault()->onSet(function ($texts) {
            // We must check which locales have changed and update cache keys for them
            foreach ($texts as $locale => $text) {
                if ($this->translations->key($locale) !== $text) {
                    $this->on('onAfterSave', function () use ($locale) {
                        // TODO I18NLocale::findByKey($locale)->updateCacheKey()->save();
                    });
                }
            }

            return $texts;
        });

    }

    protected function entityApi(ApiContainer $api)
    {
        parent::entityApi($api);

        /**
         * @api.name        Import texts
         * @api.description Finds i18n texts in given apps and imports them to local database.
         *
         * @api.body.apps   array  Apps to be exported
         */
        $api->post('scan', function () {
            $apps = $this->wRequest()->getRequestData()['apps'] ?? [];
            $options = $this->wRequest()->getRequestData()['options'] ?? [];

            return I18N::getInstance()->scanApps($apps, $options);
        })->setBodyValidators(['apps' => 'required,minLength:1'])->setPublic();

        /**
         * @api.name        Export texts and download
         * @api.description Finds i18n texts in given apps and exports them as a ZIP file which can then be imported on a
         *                  different environment. Optionally, import to local database can also be made.
         *
         * @api.body.apps   array   Apps to be scanned (min. 1 required)
         * @api.body.import boolean Imports texts into database (optional)
         */
        $api->post('export/json', function () {

            $apps = $this->wRequest()->getRequestData()['apps'];
            $groups = $this->wRequest()->getRequestData()['groups'];

            $export = new TextsExport();
            $export->setApps($apps)->setGroups($groups)->fromDb();

            $export->downloadJson();
        })->setBodyValidators(['apps' => 'required,minLength:1'])->setPublic();

        /**
         * @api.name        Import texts
         * @api.description Finds i18n texts in given apps and imports them to local database.
         *
         * @api.body.apps   array  Apps to be exported
         */
        $api->post('import/json', function () {
            $file = $this->wRequest()->getRequestData()['file'];
            $options = $this->wRequest()->getRequestData()['options'] ?? [];

            $export = new TextsExport();
            $export->fromJsonFile($file);

            return $export->toDb($options);
        })->setBodyValidators(['file' => 'required'])->setPublic();

        /**
         * @api.name        Updates text translation by ID for given language
         * @api.description Gets a translation by ID and updates the translation in given language
         */
        $api->patch('{id}/translations', function () {
            $data = $this->wRequest()->getRequestData();
            $locale = I18NLocale::findByKey($data['locale']);
            if (!$locale) {
                throw new AppException($this->wI18n('Locale not found.'));
            }

            $this->setTranslation($locale, $data['text'] ?? '')->save();

            return ['locale' => $locale->key, 'text' => $data['text']];
        })->setBodyValidators(['locale' => 'required'])->setPublic();

        /**
         * @api.name        Export translations and download
         * @api.description Exports translations for all given apps in a form of a ZIP archive.
         *
         * @api.body.apps   array   List of apps
         */
        $api->post('translations/export/{type}', function ($type) {
            $apps = $this->wRequest()->getRequestData()['apps'];
            $groups = $this->wRequest()->getRequestData()['groups'];
            $locales = $this->wRequest()->getRequestData()['locales'];

            $export = new TranslationsExport();
            $export->setApps($apps)->setGroups($groups)->setLocales($locales)->fromDb();

            switch ($type) {
                case 'yaml':
                    $export->downloadYaml();
                    break;
                case 'json':
                    $export->downloadJson();
                    break;
                default:
                    throw new AppException($this->wI18n('Invalid file type provided.'));
            }

        })->setBodyValidators([
            'apps'    => 'required',
            'groups'  => 'required',
            'locales' => 'required'
        ])->setPublic();

        /**
         * @api.name        Export translations and download
         * @api.description Exports translations for all given apps in a form of a ZIP archive.
         *
         * @api.body.apps   array   List of apps
         */
        $api->post('translations/import/{type}', function ($type) {
            $file = $this->wRequest()->getRequestData()['file'];
            $options = $this->wRequest()->getRequestData()['options'] ?? [];

            $export = new TranslationsExport();

            switch ($type) {
                case 'yaml':
                    $export->fromYamlFile($file);
                    break;
                case 'json':
                    $export->fromJsonFile($file);
                    break;
                default:
                    throw new AppException($this->wI18n('Invalid file type provided.'));
            }

            return $export->toDb($options);
        })->setBodyValidators(['file' => 'required'])->setPublic();

        $api->get('stats/translated', function () {
            $translations = $this->wDatabase()->aggregate('I18NTexts', [
                ['$match' => ['deletedOn' => null]],
                ['$project' => ['translations' => 1]],
                ['$unwind' => '$translations'],
                ['$match' => ['translations.text' => ['$ne' => ""]]],
                ['$group' => ['_id' => '$translations.locale', 'count' => ['$sum' => 1]]]
            ]);

            $translations = array_map(function($item) {
                return ['locale' => ['key' => $item['_id'], 'label' => I18NLocales::getLabel($item['_id'])], 'count' => $item['count']];
            }, $translations->toArray());

            foreach (I18NLocale::find() as $locale) {
                /* @var I18NLocale $locale */
                foreach ($translations as $translation) {
                    if ($translation['locale']['key'] === $locale->key) {
                        continue 2;
                    }
                }
                $translations[] = ['locale' => ['key' => $locale->key, 'label' => $locale->label], 'count' => 0];
            }


            usort($translations, function($a, $b) {
                return $a['locale']['label'] > $b['locale']['label'];
            });

            return [
                'texts'        => ['total' => I18NText::count()],
                'translations' => $translations
            ];

        })->setPublic();

        /**********************************************************************************************************
         *                                          !! Entity API !!                                              *
         **********************************************************************************************************/

        /**
         * @api.name        Get translation by key
         * @api.description Gets a translation by a given key.
         * @api.path.key    string  Translation key
         */
        $api->get('keys/{$key}', function ($key) {
            if ($translation = I18NText::findByKey($key)) {
                return $this->apiFormatEntity($translation, $this->wRequest()->getFields());
            }

            throw new AppException($this->wI18n('Translation not found.'));
        });

        /**
         * TODO
         * @api.name        Fetch translations
         * @api.description Fetches all translations for given language
         *
         * @api.body.language   string  Language for which the translations will be returned
         */
        $api->get('edited', function () {

            $settings = TranslationSettings::load();
            $return = [
                'cacheKey'     => $settings->key('cacheKey'),
                'translations' => []
            ];

            $language = $this->wRequest()->query('language');
            $translations = $this->mongo()->aggregate('Translations', [
                [
                    '$match' => [
                        'deletedOn' => null,
                        '$and'      => [
                            ['translations.' . $language => ['$exists' => true]],
                            ['translations.' . $language => ['$nin' => [null, ""]]]
                        ]
                    ]
                ],
                [
                    '$project' => [
                        '_id'                       => 0,
                        'key'                       => 1,
                        'translations.' . $language => 1
                    ]
                ]
            ])->toArray();

            foreach ($translations as $translation) {
                $return['translations'][Selecto::get($translation, 'key')] = Selecto::get($translation, 'translations.' . $language);
            }

            return $return;
        })->setBodyValidators(['language' => 'required']);
    }

    /**
     * Finds a translation by given key
     *
     * @param $key
     *
     * @return \Apps\Webiny\Php\Lib\Entity\AbstractEntity|null
     */
    public static function findByKey($key)
    {
        return I18NText::findOne(['key' => $key]);
    }

    /**
     * @param I18NLocale $locale
     * @param            $text
     *
     * @return $this
     */
    public function setTranslation(I18NLocale $locale, string $text)
    {
        $translations = $this->translations->val();
        foreach ($translations as &$translation) {
            if ($translation['locale'] === $locale->key) {
                $translation['text'] = $text;
                $this->translations = $translations;

                return $this;
            }
        }

        $translations[] = ['locale' => $locale->key, 'text' => $text];
        $this->translations = $translations;

        return $this;
    }

    /**
     * @param I18NLocale $locale
     *
     * @return mixed
     */
    public function getTranslation(I18NLocale $locale)
    {
        foreach ($this->translations as $translation) {
            if ($translation['locale'] === $locale->key) {
                return $translation['text'];
            }
        }
    }

    /**
     * @param I18NLocale $locale
     *
     * @return bool
     */
    public function hasTranslation(I18NLocale $locale)
    {
        return !!$this->getTranslation($locale);
    }
}