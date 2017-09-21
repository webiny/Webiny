<?php

namespace Apps\Webiny\Php\Lib\I18N;

use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class I18NTextsExport
 *
 * @property string      $key
 * @property string      $placeholder
 * @property ArrayObject $translations
 */
class I18NTranslationsExport
{
    use WebinyTrait;

    protected static $i18nNamespace = 'Webiny.Lib.I18NTranslationsExport';

    private $texts = [];
    private $apps = [];

    public function __construct($translations = [], $apps = [])
    {
        $this->texts = $translations;
        $this->apps = $apps;
    }

    public function getTexts()
    {
        return $this->texts;
    }

    public function fromJson($content)
    {
        $content = json_decode($content, true);

        $this->texts = $content['texts'] ?? [];
        $this->apps = $content['apps'] ?? [];

        return $this;
    }

    public function toJson($options = null)
    {
        return json_encode(['apps' => $this->apps, 'texts' => $this->texts], $options);
    }

    public function downloadJson()
    {
        header('Content-disposition: attachment; filename=i18n_' . time() . '.json');
        header('Content-type: application/json');
        die($this->toJson(JSON_PRETTY_PRINT));
    }
}