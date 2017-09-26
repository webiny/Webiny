<?php

namespace Apps\Webiny\Php\Lib\I18N;

use Apps\Webiny\Php\Entities\I18NLocale;
use Apps\Webiny\Php\Entities\I18NText;
use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\I18N\Modifiers\AbstractModifier;
use Apps\Webiny\Php\Lib\I18N\Modifiers\DateModifier;
use Apps\Webiny\Php\Lib\I18N\Modifiers\DateTimeModifier;
use Apps\Webiny\Php\Lib\I18N\Modifiers\GenderModifier;
use Apps\Webiny\Php\Lib\I18N\Modifiers\IfModifier;
use Apps\Webiny\Php\Lib\I18N\Modifiers\MoneyModifier;
use Apps\Webiny\Php\Lib\I18N\Modifiers\NumberModifier;
use Apps\Webiny\Php\Lib\I18N\Modifiers\PluralModifier;
use Apps\Webiny\Php\Lib\I18N\Modifiers\TimeModifier;
use Apps\Webiny\Php\Lib\I18N\Parsers\JsParser;
use Apps\Webiny\Php\Lib\I18N\Parsers\PhpParser;
use Apps\Webiny\Php\Lib\I18N\Parsers\SmartyParser;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;

class I18N
{
    protected static $i18nNamespace = 'Webiny.Lib.I18N';
    private $locale;
    private $modifiers;

    /**
     * If we fail to fetch formats for currently selected locale, these default formats will be used.
     * @type {{date: string, time: string, datetime: string, number: string}}
     */
    private static $defaultFormats = [
        'date'     => 'd/m/Y',
        'time'     => 'h:i',
        'datetime' => 'd/m/Y H:i',
        'money'    => [
            'symbol'    => '',
            'format'    => '{symbol}{amount}',
            'decimal'   => '.',
            'thousand'  => ',',
            'precision' => 2
        ],
        'number'   => [
            'decimal'   => '.',
            'thousand'  => ',',
            'precision' => 2
        ]
    ];

    use StdLibTrait, WebinyTrait, SingletonTrait;

    /**
     * Initializes I18N if it's enabled - registers basic built-in modifiers and detects locale if enabled.
     */
    public function init()
    {
        // We register basic built in modifiers.
        $this->registerModifiers([
            new IfModifier(),
            new GenderModifier(),
            new PluralModifier(),
            new DateTimeModifier(),
            new DateModifier(),
            new TimeModifier(),
            new MoneyModifier(),
            new NumberModifier(),
        ]);

        if (!$this->isEnabled()) {
            return;
        }

        $locale = $this->wCookie()->get('webiny-i18n');
        if (!$locale) {
            $locale = $this->wRequest()->header('webiny-i18n');
        }

        if ($locale) {
            $locale = I18NLocale::findByKey($locale);
            if ($locale) {
                $this->setLocale($locale);
            }
        }

        if (!$locale) {
            $this->setLocale($this->getDefaultLocale());
        }
    }

    /**
     * Tries to read default locale to be used if detection is enabled. Currently it only reads HTTP_ACCEPT_LANGUAGE
     * but can probably be upgraded to maybe do the check by user's IP address.
     * @return I18NLocale|null
     */
    public function getDefaultLocale()
    {
        /* @var I18NLocale $locale */
        if ($this->wConfig()->get('Webiny.I18n.Detect.Locale')) {
            if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
                $preferredLocales = array_reduce(explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE']), function ($res, $el) {
                    list($l, $q) = array_merge(explode(';q=', $el), [1]);
                    $res[$l] = (float)$q;

                    return $res;
                }, []);
                arsort($preferredLocales);

                foreach ($preferredLocales as $key => $priority) {
                    if ($locale = I18NLocale::findByKey($key)) {
                        if ($locale->enabled) {
                            return $locale;
                        }
                    }
                }
            }

        }

        return I18NLocale::findDefault();
    }

    /**
     * Tells us whether I18N is enabled or not.
     * @return bool
     */
    public function isEnabled()
    {
        return $this->wConfig()->get('Webiny.I18n.Enabled');
    }

    /**
     * Main method for translating - tries to fetch translation by using textKey, if nothing was found, it will return passed
     * base text.
     *
     * @param       $base
     * @param array $variables
     * @param null  $textKey
     * @param array $options
     *
     * @return string
     */
    public function translate($base, $variables = [], $textKey, $options = [])
    {
        $options['delimiters'] = $options['delimiters'] ?? ['{', '}'];

        $output = $base;

        if ($this->isEnabled()) {
            if ($text = I18NText::findByKey($textKey)) {
                $locale = $this->getLocale();
                if ($locale) {
                    /* @var I18NText $text */
                    if ($text->hasTranslation($locale)) {
                        $output = $text->getTranslation($locale);
                    }
                }
            }
        }

        // Match variables by using passed delimiters.
        $regex = '/(\\' . $options['delimiters'][0] . '.*?\\' . $options['delimiters'][1] . ')/';
        $parts = preg_split($regex, $output, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);

        return array_reduce($parts, function ($carry, $part) use ($variables, $options) {
            // If not a variable, but an ordinary text, just return it, we don't need to do any extra processing with it.
            if (strpos($part, $options['delimiters'][0]) !== 0) {
                return $carry . $part;
            }

            $part = trim($part, $options['delimiters'][0] . $options['delimiters'][1]);
            $part = explode('|', $part);
            $variable = $part[0] ?? null;
            $modifier = $part[1] ?? null;

            if (!isset($variables[$variable])) {
                return $carry . $options['delimiters'][0] . $variable . $options['delimiters'][1];
            }

            $value = $variables[$variable];

            if ($modifier) {
                $parameters = explode(':', $modifier);
                $name = array_shift($parameters);
                if (isset($this->modifiers[$name]) && $this->modifiers[$name] instanceof AbstractModifier) {
                    /* @var AbstractModifier $modifierInstance */
                    $modifierInstance = $this->modifiers[$name];

                    return $carry . $modifierInstance->execute((string)$value, $parameters);
                } else {
                    throw new AppException($this->wI18n('Invalid or missing text modifier "{name}".', ['name' => $name]));
                }
            }

            return $carry . $value;
        }, '');
    }

    /**
     * Formats datetime as defined in I18NLocale settings. Can also receive a custom output formatting rules if needed.
     *
     * @param      $value
     * @param null $outputFormat
     *
     * @return false|string
     */
    public function datetime($value, $outputFormat = null)
    {
        $format = $outputFormat;
        if (!$format) {
            $format = self::$defaultFormats['datetime'];
            $locale = $this->getLocale();
            if ($locale && $locale->formats->key('datetime')) {
                $format = $locale->formats->key('datetime');
            }
        }
        $value = strtotime($value);

        return date($format, $value);
    }

    /**
     * Formats time as defined in I18NLocale settings. Can also receive a custom output formatting rules if needed.
     *
     * @param      $value
     * @param null $outputFormat
     *
     * @return false|string
     */
    public function time($value, $outputFormat = null)
    {
        $format = $outputFormat;
        if (!$format) {
            $format = self::$defaultFormats['time'];
            $locale = $this->getLocale();
            if ($locale && $locale->formats->key('time')) {
                $format = $locale->formats->key('time');
            }
        }
        $value = strtotime($value);

        return date($format, $value);
    }

    /**
     * Formats date as defined in I18NLocale settings. Can also receive a custom output formatting rules if needed.
     *
     * @param      $value
     * @param null $outputFormat
     *
     * @return false|string
     */
    public function date($value, $outputFormat = null)
    {
        $format = $outputFormat;
        if (!$format) {
            $format = self::$defaultFormats['date'];
            $locale = $this->getLocale();
            if ($locale && $locale->formats->key('date')) {
                $format = $locale->formats->key('date');
            }
        }
        $value = strtotime($value);

        return date($format, $value);
    }

    /**
     * Formats money as defined in I18N Locale settings. Can also receive a custom output formatting rules if needed.
     *
     * @param       $value
     * @param array $outputFormat
     *
     * @return string
     */
    public function money($value, $outputFormat = [])
    {
        $format = self::$defaultFormats['money'];
        $locale = $this->getLocale();
        if ($locale) {
            $format = array_merge($format, $locale->formats->key('money'));
        }

        if (!empty($outputFormat)) {
            $format = array_merge($format, $outputFormat);
        }

        $amount = number_format($value, $format['precision'], $format['thousand'], $format['decimal']);
        $symbol = $format['symbol'];

        $output = $format['format'];
        $output = str_replace('{symbol}', $symbol, $output);
        $output = str_replace('{amount}', $amount, $output);

        return $output;
    }

    /**
     * Formats number as defined in I18N Locale settings. Can also receive a custom output formatting rules if needed.
     *
     * @param            $value
     * @param array      $outputFormat
     *
     * @return string
     */
    public function number($value, $outputFormat = [])
    {
        $format = self::$defaultFormats['number'];
        $locale = $this->getLocale();
        if ($locale) {
            $format = array_merge($format, $locale->formats->key('number'));
        }

        if (!empty($outputFormat)) {
            $format = array_merge($format, $outputFormat);
        }

        return number_format($value, $format['precision'], $format['thousand'], $format['decimal']);
    }

    /**
     * Registers single modifier.
     *
     * @param AbstractModifier $modifier
     *
     * @return $this
     */
    public function registerModifier(AbstractModifier $modifier)
    {
        $this->modifiers[$modifier->getName()] = $modifier;

        return $this;
    }

    /**
     * Registers all modifiers in given array.
     *
     * @param $modifiers    array Associative array, where names are set as keys and modifier functions as values.
     *
     * @return $this
     */
    public function registerModifiers($modifiers)
    {
        foreach ($modifiers as $modifier) {
            $this->registerModifier($modifier);
        }

        return $this;
    }

    /**
     * Unregisters given modifier.
     *
     * @param $name
     *
     * @return $this
     */
    public function unregisterModifier($name)
    {
        unset($this->modifiers[$name]);

        return $this;
    }

    /**
     * Sets current locale.
     *
     * @param string $locale
     *
     * @return $this
     */
    public function setLocale($locale)
    {
        $this->locale = $locale;

        return $this;
    }

    /**
     * Gets currently set locale.
     * @return I18NLocale|null
     */
    public function getLocale()
    {
        return $this->locale;
    }

    /**
     * Scans given apps for i18n usages (PHP, Smarty template sand JS code included).
     * Returns scan stats - how many entries were created, update and ignored.
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
     * Scans single app for i18n usages (PHP, Smarty template sand JS code included).
     * Returns scan stats - how many entries were created, update and ignored.
     *
     * @param App   $app
     * @param array $options
     *
     * @return array
     * @throws AppException
     */
    public function scanApp(App $app, $options = [])
    {
        $texts = array_merge(...[
            SmartyParser::getInstance()->parse($app),
            PhpParser::getInstance()->parse($app),
            JsParser::getInstance()->parse($app),
        ]);

        $options['overwriteExisting'] = $options['overwriteExisting'] ?? false;
        $options['preview'] = $options['preview'] ?? false;
        $stats = ['updated' => 0, 'created' => 0, 'ignored' => 0];

        // Now we know the data is valid, let's do the import.
        foreach ($texts as $text) {
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

}