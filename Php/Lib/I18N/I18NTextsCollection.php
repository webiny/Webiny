<?php

namespace Apps\Webiny\Php\Lib\I18N;

use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class I18NTextsCollection
 *
 * @property string      $key
 * @property string      $placeholder
 * @property ArrayObject $translations
 */
class I18NTextsCollection
{
    use WebinyTrait;

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
}