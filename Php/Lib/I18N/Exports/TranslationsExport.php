<?php

namespace Apps\Webiny\Php\Lib\I18N\Exports;

use Apps\Webiny\Php\Entities\I18NLocale;
use Apps\Webiny\Php\Entities\I18NText;
use Apps\Webiny\Php\Entities\I18NTextGroup;
use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Symfony\Component\Yaml\Yaml;


class TranslationsExport extends TextsExport
{
    use WebinyTrait;

    protected static $i18nNamespace = 'Webiny.Lib.TranslationsExport';

    protected $locales = [];

    /**
     * @return $this
     */
    public function fromDb()
    {
        $apps = array_map(function (App $app) {
            return $app->getName();
        }, $this->apps);

        $groups = array_map(function ($group) {
            /* @var I18NTextGroup|null $group */
            return $group ? $group->id : null;
        }, $this->groups);

        $databaseTexts = self::wDatabase()->aggregate('I18NTexts', [
            ['$match' => ['deletedOn' => null, 'app' => ['$in' => $apps], 'group' => ['$in' => $groups]]],
            [
                '$lookup' => [
                    'from'         => 'I18NTextGroups',
                    'localField'   => 'group',
                    'foreignField' => 'id',
                    'as'           => 'group'
                ]
            ],
            ['$project' => ['_id' => 0, 'app' => 1, 'group.id' => 1, 'group.name' => 1, 'translations' => 1, 'key' => 1, 'base' => 1]]
        ]);

        $appsTexts = [];
        foreach ($databaseTexts as $databaseText) {
            $app = $databaseText['app'];

            if (!isset($appsTexts[$app])) {
                $appsTexts[$app] = [];
            }

            $locales = array_map(function (I18NLocale $locale) {
                return $locale->key;
            }, $this->locales);

            $translations = [];
            foreach ($databaseText['translations'] as $translation) {
                if (in_array($translation['locale'], $locales)) {
                    $translations[$translation['locale']] = $translation['text'];
                }
            }

            $appsTexts[$app][$databaseText['key']] = [
                'Base'         => $databaseText['base'],
                'Translations' => $translations
            ];
        }

        $this->texts = $appsTexts;

        return $this;
    }

    public function toDb($options = null)
    {
        $options['preview'] = $options['preview'] ?? false;

        $dbTranslations = [];
        // Let's do initial checks before actually doing the import.
        foreach ($this->texts as $app => $appTexts) {
            foreach ($appTexts as $key => $text) {
                $entity = ['I18NTexts', ['deletedOn' => null, 'key' => $key], ['projection' => ['_id' => 0, 'translations' => 1]]];
                $entity = $this->wDatabase()->findOne(...$entity);
                if (!$entity) {
                    throw new AppException($this->wI18n('Text with key {key} not found, import aborted.', ['key' => $key]));
                }
                $dbTranslations[$key] = $entity['translations'];
            }
        }

        $stats = ['inserted' => 0, 'updated' => 0, 'ignored' => 0];

        // Let's merge new translations and do updates in database.
        foreach ($this->texts as $app => $appTexts) {
            foreach ($appTexts as $key => $appText) {

                // Let's merge newly received translations with the ones in the database
                foreach ($appText['Translations'] as $locale => $text) {
                    $existingTranslationIndex = -1;
                    foreach ($dbTranslations[$key] as $index => $translation) {
                        if ($translation['locale'] === $locale) {
                            $existingTranslationIndex = $index;
                            break;
                        }
                    }

                    if ($existingTranslationIndex >= 0) {
                        if ($dbTranslations[$key][$existingTranslationIndex]['text'] === $text) {
                            $stats['ignored']++;
                            continue;
                        } else {
                            $dbTranslations[$key][$existingTranslationIndex]['text'] = $text;
                            $stats['updated']++;
                        }
                    } else {
                        $dbTranslations[$key][] = ['locale' => $locale, 'text' => $text];
                        $stats['inserted']++;
                    }
                }

                if (!$options['preview']) {
                    $this->wDatabase()->update('I18NTexts', ['key' => $key], ['$set' => ['translations' => $dbTranslations[$key]]]);
                }

                unset($dbTranslations[$key]);
            }
        }

        return $stats;
    }

    public function getLocales()
    {
        return $this->locales;
    }

    /**
     * @param array $locales
     *
     * @return $this
     */
    public function setLocales(array $locales)
    {
        $this->locales = array_map(function ($locale) {
            if (!$locale instanceof I18NLocale) {
                $key = $locale;
                $locale = I18NLocale::findByKey($key);
                if (!$locale) {
                    throw new AppException($this->wI18n('Export failed, locale with key {key} not found.', ['key' => $key]));
                }
            }

            return $locale;
        }, $locales);

        return $this;
    }

    public function fromJson($content)
    {
        return json_decode($content, true);
    }

    public function fromJsonFile($data)
    {
        $data = $this->fromBase64EncodedFile($data);
        $this->texts = $this->fromJson($data);

        return $this;
    }

    public function toJson($options = null)
    {
        return json_encode($this->texts, $options);
    }

    public function fromYaml($content)
    {
        return Yaml::parse($content);
    }

    public function fromYamlFile($data)
    {
        $data = $this->fromBase64EncodedFile($data);
        $this->texts = $this->fromYaml($data);

        return $this;
    }

    public function toYaml()
    {

        return Yaml::dump($this->texts, 4);
    }

    public function downloadYaml()
    {
        header('Content-disposition: attachment; filename=i18n_' . time() . '.yaml');
        header('Content-type: application/x-yaml');
        die($this->toYaml());
    }

    private function mergeTranslations($translations1, $translations2)
    {
        $return = $translations2;

        foreach ($translations1 as $locale => $text) {
            $existingTranslationIndex = -1;
            foreach ($return as $index => $translation) {
                if ($translation['locale'] === $locale) {
                    $existingTranslationIndex = $index;
                    break;
                }
            }

            if ($existingTranslationIndex >= 0) {
                $return[$existingTranslationIndex]['text'] = $text;
            } else {
                $return[] = ['locale' => $locale, 'text' => $text];
            }
        }

        return $return;
    }

}