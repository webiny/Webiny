<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Entity\EntityQuery\EntityQuery;
use Apps\Webiny\Php\Lib\Entity\EntityQuery\Filter;
use Apps\Webiny\Php\Lib\Entity\EntityQuery\QueryContainer;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\I18N\I18N;
use Apps\Webiny\Php\Lib\I18N\I18NTextsCollection;
use Apps\Webiny\Php\Lib\I18N\I18NScanner;
use Apps\Webiny\Php\Lib\I18N\I18NTextsExport;
use Apps\Webiny\Php\Lib\WebinyTrait;
use PHPZip\Zip\Stream\ZipStream;
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
                        I18NLocale::findByKey($locale)->updateCacheKey()->save();
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
            $results = I18N::getInstance()->scanApps($apps);

            return I18N::getInstance()->importTexts($results, ['overwriteExisting' => false]);
        })->setBodyValidators(['apps' => 'required,minLength:1'])->setPublic();

        /**
         * @api.name        Export texts and download
         * @api.description Finds i18n texts in given apps and exports them as a ZIP file which can then be imported on a
         *                  different environment. Optionally, import to local database can also be made.
         *
         * @api.body.apps   array   Apps to be scanned (min. 1 required)
         * @api.body.import boolean Imports texts into database (optional)
         */
        $api->post('export/zip', function () {
            $apps = $this->wRequest()->getRequestData()['apps'] ?? [];
            $export = I18N::getInstance()->exportTexts($apps);

            $zip = new ZipStream('i18n_' . time() . '.zip', 'application/zip', null, true);
            $zip->addFile($export->toJson(), 'export');

            return $zip->finalize();
        })->setBodyValidators(['apps' => 'required,minLength:1'])->setPublic();

        /**
         * @api.name        Import texts
         * @api.description Finds i18n texts in given apps and imports them to local database.
         *
         * @api.body.apps   array  Apps to be exported
         */
        $api->post('import/zip', function () {
            $src = $this->wRequest()->getRequestData()['file']['src'] ?? null;

            return I18N::getInstance()->importTextsFromZip($src, ['overwriteExisting' => true]);
        })->setBodyValidators(['file' => 'required'])->setPublic();

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
         * @api.name        Create new translation
         * @api.description Creates a new translation.
         * @api.body.key    string  Translation key
         * @api.body.base   string  Default placeholder text for this translation (default text if no translation for selected language is present).
         */
        $api->post('keys', function () {
            $data = $this->wRequest()->getRequestData();
            $translation = I18NText::findByKey($data['key']);
            if (!$translation) {
                $translation = new I18NText();
                $translation->key = $data['key'];
                $translation->base = $data['base'] ?? null;
                $translation->save();
            }

            return $this->apiFormatEntity($translation, $this->wRequest()->getFields());
        })->setBodyValidators([
            'key'  => 'required',
            'base' => 'required'
        ]);

        /**
         * @api.name        Updates translation by key for given language
         * @api.description Gets a translation by a given key and updates it with received data
         *
         * @api.body.apps   array   Apps to be scanned (min. 1 required)
         */
        $api->patch('keys/{$key}', function ($key) {
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
                $translation->base = $data['base'] ?? null;
                $translation->translations->key($data['language'], $data['translation']);
                $translation->save();
            }

            return $translation;
        })->setBodyValidators([
            'language' => 'required',
            'base'     => 'required'
        ]);

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

    public function getText(I18NLocale $locale)
    {
        return $this->translations->key($locale->key);
    }

    public function hasText(I18NLocale $locale)
    {
        return $this->translations->key($locale->key);
    }
}