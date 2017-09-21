<?php

namespace Apps\Webiny\Php\Lib\I18N\I18N;

use Apps\Webiny\Php\Entities\I18NLocale;
use Apps\Webiny\Php\Entities\I18NTextGroup;
use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\I18N\I18NTranslationsExport;
use Apps\Webiny\Php\Lib\WebinyTrait;


class ExportTranslations extends ExportTexts
{
    use WebinyTrait;

    protected static $i18nNamespace = 'Webiny.Lib.ExportTranslations';

    protected $locales = [];

    /**
     * ExportTranslations constructor.
     *
     * @param $apps
     * @param $groups
     * @param $locales
     */
    public function __construct($apps, $groups, $locales)
    {
        parent::__construct($apps, $groups);

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
    }

    /**
     * @return I18NTranslationsExport
     */
    public function execute()
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
            $group = isset($databaseText['group'][0]) ? $databaseText['group'][0]['name'] : null;

            if (!isset($appsTexts[$app])) {
                $appsTexts[$app] = [];
            }

            $appTextsIndex = -1;
            foreach ($appsTexts[$app] as $index => $appTexts) {
                if ($group) {
                    if (isset($appTexts['group']) && $appTexts['group'] === $group) {
                        $appTextsIndex = $index;
                        break;
                    }
                } else {
                    if (!isset($appTexts['group'])) {
                        $appTextsIndex = $index;
                        break;
                    }
                }
            }

            if ($appTextsIndex === -1) {
                if ($group) {
                    $array['group'] = $group;
                }
                $array['texts'] = [];

                $appsTexts[$app][] = $array;
                $appTextsIndex = count($appsTexts[$app]) - 1;
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

            $appsTexts[$app][$appTextsIndex]['texts'][] = [
                'key'          => $databaseText['key'],
                'base'         => $databaseText['base'],
                'translations' => $translations
            ];
        }

        return new I18NTranslationsExport($appsTexts);
    }
}