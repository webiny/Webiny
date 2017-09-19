<?php

namespace Apps\Webiny\Php\Lib\I18N;

use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class I18NTextsExport
 *
 * @property string      $key
 * @property string      $placeholder
 * @property ArrayObject $translations
 */
class I18NTextsExport
{
    use WebinyTrait;

    protected static $i18nNamespace = 'Webiny.Lib.I18NTextsExport';

    private $groups = [];
    private $texts = [];
    private $apps = [];

    public function __construct($texts = [], $groups = [], $apps = [])
    {
        $this->texts = $texts;
        $this->groups = $groups;
        $this->apps = $apps;
    }

    public function getTexts()
    {
        return $this->texts;
    }

    public function getGroups()
    {
        return $this->groups;
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

    public function toJson()
    {
        return json_encode(['groups' => $this->groups, 'texts' => $this->texts, 'apps' => $this->apps]);
    }
}