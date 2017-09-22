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
        foreach ($this->texts as $app => $texts) {
            foreach ($texts as $key => $text) {
                $entity = I18NText::findByKey($key);
                if (!$entity) {

                }
            }
        }
    }


    public function toJson($options = null)
    {
        return json_encode(['apps' => $this->apps, 'groups' => $this->groups, 'texts' => $this->texts]);
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