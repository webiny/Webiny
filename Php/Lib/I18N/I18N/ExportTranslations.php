<?php

namespace Apps\Webiny\Php\Lib\I18N\I18N;

use Apps\Webiny\Php\Entities\I18NLocale;
use Apps\Webiny\Php\Entities\I18NTextGroup;
use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\I18N\I18NTranslationsExport;
use Apps\Webiny\Php\Lib\WebinyTrait;


class ExportTranslations
{
    use WebinyTrait;

    protected static $i18nNamespace = 'Webiny.Lib.ExportTranslations';

    private $apps = [];
    private $groups = [];
    private $locales = [];

    /**
     * ExportTranslations constructor.
     *
     * @param $apps
     * @param $groups
     * @param $locales
     */
    public function __construct($apps, $groups, $locales)
    {
        // Normalize list of apps.
        $this->apps = array_map(function ($app) {
            if (!$app instanceof App) {
                $name = $app;
                $app = $this->wApps()->getApp($name);
                if (!$app) {
                    throw new AppException($this->wI18n('Export failed, app {app} not found.', ['app' => $name]));
                }
            }

            return $app;
        }, $apps);

        // Normalize list of groups.
        $this->groups = array_map(function ($group) {
            if ($group === 'none') {
                return null;
            }

            if (!$group instanceof I18NTextGroup) {
                $id = $group;
                $group = I18NTextGroup::findById($id);
                if (!$group) {
                    throw new AppException($this->wI18n('Export failed, app with ID {id} not found.', ['id' => $id]));
                }
            }

            return $group;

        }, $groups);

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
            /* @var I18NTextGroup|null $group  */
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

            $appTextsIndex = -1;
            foreach ($appsTexts as $index => $appTexts) {
                if ($appTexts['app'] !== $app) {
                    continue;
                }

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
                $array = ['app' => $app];
                if ($group) {
                    $array['group'] = $group;
                }
                $array['texts'] = [];

                $appsTexts[] = $array;
                $appTextsIndex = count($appsTexts) - 1;
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

            $appsTexts[$appTextsIndex]['texts'][] = $translations;
        }

        return new I18NTranslationsExport($appsTexts, $apps);
    }
}