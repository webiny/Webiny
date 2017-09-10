<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Entity\EntityQuery\EntityQuery;
use Apps\Webiny\Php\Lib\Entity\EntityQuery\Filter;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\I18N\I18N;
use Apps\Webiny\Php\Lib\I18N\I18NAppTexts;
use Apps\Webiny\Php\Lib\WebinyTrait;
use PHPZip\Zip\Stream\ZipStream;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class User
 *
 * @package Apps\Selecto\Php\Entities
 *
 * @property string      $key
 * @property string      $app
 * @property string      $placeholder
 * @property ArrayObject $translations
 */
class I18NText extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'I18NTranslations';

    protected static function entityQuery()
    {
        // TODO
        return [
            new Filter('edited', function (EntityQuery $query, $flag) {
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
            })
        ];
    }

    public function __construct()
    {
        parent::__construct();

        $this->attr('app')->char()->setValidators('required')->setToArrayDefault()->setOnce();
        $this->attr('key')->char()->setValidators('required,unique')->setToArrayDefault()->setOnce();
        $this->attr('placeholder')->char()->setValidators('required')->setToArrayDefault()->setOnce();
        $this->attr('translations')->object()->setToArrayDefault()->onSet(function ($texts) {
            // We must check which locales have changed and update cache keys for them
            foreach ($texts as $locale => $text) {
                if ($this->translations->key($locale) !== $text) {
                    $this->on('onAfterSave', function () use ($locale) {
                        I18NLocale::findByKey($locale)->updateCacheKey()->save();
                    });
                }
            }

            return $texts;
        });

        /**
         * @api.name        Get translation by key
         * @api.description Gets a translation by a given key.
         * @api.path.key    string  Translation key
         */
        $this->api('GET', 'keys/{$key}', function ($key) {
            if ($translation = I18NText::findByKey($key)) {
                return $this->apiFormatEntity($translation, $this->wRequest()->getFields());
            }

            throw new AppException($this->i18n('Translation not found.'));
        });

        /**
         * @api.name        Create new translation
         * @api.description Creates a new translation.
         * @api.body.key            string  Translation key
         * @api.body.placeholder    string  Default placeholder text for this translation (default text if no translation for selected language is present).
         */
        $this->api('POST', 'keys', function () {
            $data = $this->wRequest()->getRequestData();
            $translation = I18NText::findByKey($data['key']);
            if (!$translation) {
                $translation = new I18NText();
                $translation->key = $data['key'];
                $translation->placeholder = $data['placeholder'] ?? null;
                $translation->save();
            }

            return $this->apiFormatEntity($translation, $this->wRequest()->getFields());
        })->setBodyValidators([
            'key'         => 'required',
            'placeholder' => 'required'
        ]);

        /**
         * @api.name        Updates translation by key for given language
         * @api.description Gets a translation by a given key and updates it with received data
         *
         * @api.body.apps   array  List of apps for which the translations are needed.
         */
        $this->api('PATCH', 'keys/{$key}', function ($key) {
            $data = $this->wRequest()->getRequestData();
            $data['translation'] = $data['translation'] ?? '';

            $translation = I18NText::findByKey($key);
            if ($translation) {
                /* @var I18NText $translation */
                $translation->translations->key($data['language'], $data['translation']);
                $translation->save();
            } else {
                $translation = new I18NText();
                $translation->key = $key;
                $translation->placeholder = $data['placeholder'] ?? null;
                $translation->translations->key($data['language'], $data['translation']);
                $translation->save();
            }

            return $translation;
        })->setBodyValidators([
            'language'    => 'required',
            'placeholder' => 'required'
        ]);

        /**
         * @api.name        Import texts
         * @api.description Finds i18n texts in given apps and imports them to local database.
         *
         * @api.body.apps   array  Apps to be exported
         */
        $this->api('POST', 'scan/import', function () {
            throw new AppException('basddaadsdas');
            $apps = $this->getApps($this->wRequest()->getRequestData()['apps'] ?? []);
            $results = I18N::parseApps($apps);

            return I18N::import($results);
        })->setPublic();

        /**
         * @api.name        Export texts and download
         * @api.description Finds i18n texts in given apps and exports them as a ZIP file which can then be imported on a
         *                  different environment. Optionally, import to local database can also be made.
         *
         * @api.body.apps   array   Apps to be exported
         * @api.body.import boolean Imports texts into database (optional)
         */
        $this->api('POST', 'scan/export', function () {
            $apps = $this->wRequest()->getRequestData()['apps'] ?? [];
            if (empty($apps)) {
                die('Please pass at least one app for text scanning.');
            }

            $import = filter_var($this->wRequest()->getRequestData()['import'] ?? false, FILTER_VALIDATE_BOOLEAN);
            $results = I18N::parseApps($apps);

            if ($import) {
                I18N::import($results);
            }

            $zip = new ZipStream('i18n_' . time() . '.zip', 'application/zip', null, true);
            foreach ($results as $appTexts) {
                /* @var I18NAppTexts $appTexts */
                $zip->addFile($appTexts->toJson(), $appTexts->getApp()->getName());
            }

            return $zip->finalize();
        })->setPublic();

        /**
         * TODO
         * @api.name        Fetch translations
         * @api.description Fetches all translations for given language
         *
         * @api.body.language   string  Language for which the translations will be returned
         */
        $this->api('GET', 'edited', function () {

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

    public function getText($locale)
    {
        return $this->translations->key($locale);
    }

    public function hasText($locale)
    {
        return $this->translations->key($locale);
    }

    private function getApps($list = [])
    {
        if (empty($list)) {
            return $this->wApps();
        }

        return array_map(function ($name) {
            return $this->wApps($name);
        }, $list);
    }
}