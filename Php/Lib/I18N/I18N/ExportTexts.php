<?php

namespace Apps\Webiny\Php\Lib\I18N\I18N;

use Apps\Webiny\Php\Entities\I18NTextGroup;
use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\I18N\I18NTranslationsExport;
use Apps\Webiny\Php\Lib\WebinyTrait;


class ExportTexts
{
    use WebinyTrait;

    protected static $i18nNamespace = 'Webiny.Lib.ExportTexts';

    protected $apps = [];
    protected $groups = [];

    /**
     * ExportTranslations constructor.
     *
     * @param $apps
     * @param $groups
     */
    public function __construct($apps, $groups)
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

        $texts = self::wDatabase()->find(...[
            'I18NTexts',
            ['deletedOn' => null, 'app' => ['$in' => $apps], 'group' => ['$in' => $groups]],
            [],
            0,
            0,
            ['projection' => ['_id' => 0, 'app' => 1, 'group' => 1, 'key' => 1, 'base' => 1]]
        ]);

        $groups = I18NTextGroup::find(['app' => ['$in' => $apps]])->toArray('id,name,app,description');

        return new I18NTextsExport($texts, $groups, $apps);
    }
}