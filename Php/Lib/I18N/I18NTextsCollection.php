<?php

namespace Apps\Webiny\Php\Lib\I18N;

use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class User
 *
 * @package Apps\Selecto\Php\Entities
 *
 * @property string      $key
 * @property string      $placeholder
 * @property ArrayObject $translations
 */
class I18NTextsCollection
{
    use WebinyTrait;

    protected static $i18nNamespace = 'Webiny.Lib.I18N';

    private $texts = [];

    public function __construct($texts = [])
    {
        $this->texts = $texts;
    }

    public function appendTextsCollection(I18NTextsCollection $i18NTextsCollection)
    {
        $this->texts = array_merge($this->texts, $i18NTextsCollection->getTexts());
    }

    public function getTexts()
    {
        return $this->texts;
    }

    public function fromJson($content)
    {
        $content = json_decode($content, true);

        if (!is_array($content)) {
            throw new AppException($this->wI18n('Received an invalid JSON file.'));
        }

        $this->texts = $content['texts'] ?? [];

        return $this;
    }

    public function toJson()
    {
        return json_encode(['texts' => $this->texts]);
    }
}