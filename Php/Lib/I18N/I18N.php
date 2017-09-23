<?php

namespace Apps\Webiny\Php\Lib\I18N;

use Apps\Webiny\Php\Entities\I18NLocale;
use Apps\Webiny\Php\Entities\I18NText;
use Apps\Webiny\Php\Entities\I18NTextGroup;
use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\I18N\I18N\ExportTexts;
use Apps\Webiny\Php\Lib\I18N\I18N\ExportTranslations;
use Apps\Webiny\Php\Lib\I18N\Parsers\JsParser;
use Apps\Webiny\Php\Lib\I18N\Parsers\PhpParser;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class I18N
 *
 * @property string      $key
 * @property string      $placeholder
 * @property ArrayObject $translations
 */
class I18N
{
    protected static $i18nNamespace = 'Webiny.Lib.I18N';

    private $locale;

    use StdLibTrait, WebinyTrait, SingletonTrait;

    /**
     * Sets current locale.
     *
     * @param string $language
     *
     * @return $this
     */
    public function setLocale($language)
    {
        $this->locale = $language;

        return $this;
    }

    /**
     * Gets currently set locale.
     * @return I18NLocale|null
     */
    public function getLocale()
    {
        if ($this->locale) {
            return $this->locale;
        }

        $this->locale = I18NLocale::findByKey($this->locale);

        return $this->locale;
    }

    /**
     * Scans given apps for i18n usages (both PHP and JS code).
     *
     * @param array $list
     *
     * @param array $options
     *
     * @return array
     */
    public function scanApps(array $list, $options = [])
    {
        // Normalize list of apps.
        $list = array_map(function ($app) {
            return is_string($app) ? self::wApps($app) : $app;
        }, $list);

        $stats = ['created' => 0, 'updated' => 0, 'ignored' => 0];

        // Parse one-by-one.
        foreach ($list as $app) {
            $scan = self::getInstance()->scanApp($app, $options);
            $stats['created'] += $scan['created'];
            $stats['updated'] += $scan['updated'];
            $stats['ignored'] += $scan['ignored'];
        }

        return $stats;
    }

    /**
     * Scans given app for i18n usages (both PHP and JS code).
     *
     * @param App   $app
     * @param array $options
     *
     * @return array
     * @throws AppException
     */
    public function scanApp(App $app, $options = [])
    {
        $texts = array_merge(PhpParser::getInstance()->parse($app), JsParser::getInstance()->parse($app));

        $options['overwriteExisting'] = $options['overwriteExisting'] ?? false;
        $stats = ['updated' => 0, 'created' => 0, 'ignored' => 0];

        // Now we know the data is valid, let's do the import.
        foreach ($texts as $text) {
            // If text already exists in the database, we only update if overwriteExisting is set to true.
            $i18nText = I18NText::findOne(['key' => $text['key']]);
            if ($i18nText) {
                if ($options['overwriteExisting']) {
                    /* @var I18NText $i18nText */
                    $i18nText->populate($text)->save();
                    $stats['updated']++;
                } else {
                    $stats['ignored']++;
                }
                continue;
            }

            $i18nText = new I18NText();
            $i18nText->populate($text)->save();
            $stats['created']++;
        }

        return $stats;

    }

    /**********************************************************************************************************
     *                                                  TEST                                                  *
     **********************************************************************************************************/

    /**
     * Tells us whether I18N is enabled or not.
     * @return bool
     */
    public function isEnabled()
    {
        return true;
    }

    /**
     * @param       $base
     * @param array $variables
     * @param array $options
     *
     * @return $this|mixed|\Webiny\Component\StdLib\StdObject\StringObject\StringObject
     * @throws AppException
     */
    public function translate($base, $variables = [], $options = [])
    {
        $output = $base;
        $namespace = $options['namespace'] ?? null;
        if (!$namespace) {
            throw new AppException('Cannot translate - text namespace missing.');
        }

        if ($text = I18NText::findByKey($namespace . '.' . md5($base))) {
            $locale = $this->getLocale();
            /* @var I18NText $text */
            if ($text->hasTranslation($locale)) {
                $output = $text->getTranslation($locale);
            }
        }

        // Match variables
        preg_match_all('/\{(.*?)\}/', $output, $matches);
        $matches = $matches[1] ?? [];
        foreach ($matches as $match) {
            $variableName = '{' . $match . '}';
            if (isset($variables[$match]) && strpos($output, $variableName) !== -1) {
                $output = str_replace($variableName, $variables[$match], $output);
            }
        }

        return $output;
    }
}