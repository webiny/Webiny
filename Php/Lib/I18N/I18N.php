<?php

namespace Apps\Webiny\Php\Lib\I18N;

use Apps\Webiny\Php\Entities\I18NLocale;
use Apps\Webiny\Php\Entities\I18NText;
use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;
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
class I18N
{
    private $locale;

    use StdLibTrait, WebinyTrait, SingletonTrait;

    public function isEnabled()
    {
        return true;
    }

    public function translate($placeholder, $key, $variables = [])
    {
        $language = 'en_GB';

        $text = $placeholder;
        if ($translation = I18NText::findByKey($key)) {
            /* @var I18NText $translation */
            if ($translation->hasText($language)) {
                $text = $translation->getText($language);
            }
        }

        // Match variables
        preg_match_all('/\{(.*?)\}/', $text, $matches);
        $matches = $matches[1] ?? [];
        foreach ($matches as $match) {
            $variableName = '{' . $match . '}';
            if (isset($variables[$match]) && strpos($variableName, $text) >= 0) {
                $text = str_replace($variableName, $variables[$match], $text);
            }
        }

        return $text;
    }

    /**
     * @return string
     */
    public function getLanguage()
    {
        return $this->locale;
    }

    /**
     * @param string $language
     *
     * @return $this
     */
    public function setLocale($language)
    {
        $this->locale = $language;

        return $this;
    }

    public function getLocale()
    {
        if ($this->locale) {
            return $this->locale;
        }

        $this->locale = I18NLocale::findByKey($this->locale);

        return $this->locale;
    }

    /**
     * @param mixed $data
     *
     * @return array|I18NAppTexts
     */
    public function importText($data)
    {
        if (!is_array($data)) {
            $data = [$data];
        }

        $stats = ['skipped' => 0, 'added' => 0];

        foreach ($data as $appTexts) {
            /* @var I18NAppTexts $appTexts */
            foreach ($appTexts->getTexts() as $key => $texts) {
                foreach ($texts as $text) {
                    $textKey = $key . '.' . md5($text);
                    if (I18NText::count(['key' => $textKey])) {
                        $stats['skipped']++;
                        continue;
                    }

                    $i18nText = new I18NText();
                    $i18nText->key = $textKey;
                    $i18nText->app = $appTexts->getApp()->getName();
                    $i18nText->placeholder = $text;
                    $i18nText->save();

                    $stats['added']++;
                }
            }
        }

        return $stats;
    }

    public function importTranslations() {}
}