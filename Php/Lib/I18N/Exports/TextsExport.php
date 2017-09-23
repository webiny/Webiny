<?php

namespace Apps\Webiny\Php\Lib\I18N\Exports;

use Apps\Webiny\Php\Entities\I18NText;
use Apps\Webiny\Php\Entities\I18NTextGroup;
use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\WebinyTrait;


class TextsExport extends AbstractExport
{
    use WebinyTrait;

    protected static $i18nNamespace = 'Webiny.Lib.TextsExport';

    protected $apps = [];
    protected $groups = [];

    public function fromDb()
    {
        $apps = array_map(function (App $app) {
            return $app->getName();
        }, $this->apps);

        $groups = array_map(function ($group) {
            /* @var I18NTextGroup|null $group */
            return $group ? $group->id : null;
        }, $this->groups);

        $this->texts = self::wDatabase()->find(...[
            'I18NTexts',
            ['deletedOn' => null, 'app' => ['$in' => $apps], 'group' => ['$in' => $groups]],
            [],
            0,
            0,
            ['projection' => ['_id' => 0, 'app' => 1, 'group' => 1, 'key' => 1, 'base' => 1]]
        ]);

        $this->groups = I18NTextGroup::find(['app' => ['$in' => $apps]])->toArray('id,name,app,description');
    }

    public function toDb($options = null)
    {
        $options['overwriteExisting'] = $options['overwriteExisting'] ?? false;
        $options['preview'] = $options['preview'] ?? false;
        $stats = ['updated' => 0, 'created' => 0, 'ignored' => 0, 'groups' => ['updated' => 0, 'created' => 0, 'ignored' => 0]];

        // First iteration is just to make sure all data is valid.
        foreach ($this->texts as $text) {
            if (!$text['key'] ?? null) {
                throw new AppException($this->wI18n('Invalid export format (text key missing).'));
            }

            if (!$text['base'] ?? null) {
                throw new AppException($this->wI18n('Invalid export format (base text missing).'));
            }
        }

        foreach ($this->groups as $data) {
            $id = $data['id'] ?? null;
            $group = I18NTextGroup::findById($id);
            if (!$group) {
                $group = new I18NTextGroup();
                $group->id = $id;
                $group->name = $data['name'];
                $group->description = $data['description'];
                $group->app = $data['app'];

                if (!$options['preview']) {
                    $group->save();
                }
                $stats['groups']['created']++;
            } else {
                if ($options['overwriteExisting']) {
                    /* @var I18NTextGroup $group */
                    $group->name = $data['name'];
                    $group->description = $data['description'];
                    $group->app = $data['app'];
                    if (!$options['preview']) {
                        $group->save();
                    }
                    $stats['groups']['updated']++;
                } else {
                    $stats['groups']['ignored']++;
                }
            }
        }

        // Now we know the data is valid, let's do the import.
        foreach ($this->texts as $text) {
            // If text already exists in the database, we only update if overwriteExisting is set to true.
            $i18nText = I18NText::findOne(['key' => $text['key']]);
            if ($i18nText) {
                if ($options['overwriteExisting']) {
                    /* @var I18NText $i18nText */
                    if (!$options['preview']) {
                        $i18nText->populate($text)->save();
                    }
                    $stats['updated']++;
                } else {
                    $stats['ignored']++;
                }
                continue;
            }

            if (!$options['preview']) {
                $i18nText = new I18NText();
                $i18nText->populate($text)->save();
            }

            $stats['created']++;
        }

        return $stats;
    }

    public function toJson($options = null)
    {
        $apps = array_map(function (App $app) {
            return $app->getName();
        }, $this->apps);

        return json_encode(['apps' => $apps, 'groups' => $this->groups, 'texts' => $this->texts]);
    }

    public function fromJson($content)
    {
        $content = json_decode($content, true);

        if (!is_array($content)) {
            throw new AppException($this->wI18n('Received an invalid JSON file.'));
        }

        if (!isset($content['groups']) && !is_array($content['groups'])) {
            throw new AppException($this->wI18n('Received an invalid JSON file (groups missing).'));
        }

        if (!isset($content['texts']) && !is_array($content['texts'])) {
            throw new AppException($this->wI18n('Received an invalid JSON file (texts missing).'));
        }

        if (!isset($content['apps']) && !is_array($content['apps'])) {
            throw new AppException($this->wI18n('Received an invalid JSON file (apps list missing).'));
        }

        $this->groups = $content['groups'] ?? [];
        $this->texts = $content['texts'] ?? [];
        $this->apps = $content['apps'] ?? [];

        return $this;
    }

    /**
     * @return array
     */
    public function getGroups(): array
    {
        return $this->groups;
    }

    /**
     * @param array $groups
     *
     * @return $this
     */
    public function setGroups(array $groups)
    {
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

        return $this;
    }
}