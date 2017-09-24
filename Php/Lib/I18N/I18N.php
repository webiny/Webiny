<?php

namespace Apps\Webiny\Php\Lib\I18N;

use Apps\Webiny\Php\Entities\I18NLocale;
use Apps\Webiny\Php\Entities\I18NText;
use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
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

    private $modifiers;

    use StdLibTrait, WebinyTrait, SingletonTrait;

    public function init()
    {
        $this->modifiers = [
            'if'     => function ($value, $parameters) {
                return $value === $parameters[0] ? $parameters[1] : $parameters[2] || '';
            },
            'gender' => function ($value, $parameters) {
                return $value === 'male' ? $parameters[0] : $parameters[1];
            },
            'plural' => function ($value, $parameters) {
                // Numbers can be single number or ranges.
                for ($i = 0; $i < count($parameters); $i = $i + 2) {
                    $current = $parameters[$i];
                    if ($current === 'default') {
                        return $value . ' ' . $parameters[$i + 1];
                    }

                    $numbers = explode('|', $current);

                    // If we are dealing with a numbers range, then let's check if we are in it.
                    if (count($numbers) === 2) {
                        if ($value >= $numbers[0] && $value <= $numbers[1]) {
                            return $value . ' ' . $parameters[$i + 1];
                        }
                        continue;
                    }

                    if ($value === $numbers[0]) {
                        return $value . ' ' . $parameters[$i + 1];
                    }

                    // If we didn't match any condition, let's just remove the received value.
                    return $value;
                }
            }
        ];
    }


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
        $parts = preg_split('/(\{.*?\})/', $output, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);

        return array_reduce($parts, function ($carry, $part) use ($variables) {
            // If not a variable, but an ordinary text, just return it, we don't need to do any extra processing with it.
            if (strpos($part, '{') !== 0) {
                return $carry . $part;
            }

            $part = trim($part, '{}');
            $part = explode('|', $part);
            $variable = $part[0] ?? null;
            $modifier = $part[1] ?? null;

            if (!isset($variables[$variable])) {
                throw new AppException($this->wI18n('Value for variable {name} is undefined.', ['name' => $variable]));
            }

            $value = $variables[$variable];

            if ($modifier) {
                $parameters = explode(':', $modifier);
                $name = array_shift($parameters);
                if (isset($this->modifiers[$name]) && is_callable($this->modifiers[$name])) {
                    return $carry . $this->modifiers[$name]((string)$value, $parameters);
                } else {
                    throw new AppException($this->wI18n('Invalid or missing text modifier "{name}".', ['name' => $name]));
                }
            }

            return $carry . $value;

        }, '');
    }


    /**
     * Registers single modifier.
     *
     * @param $name
     * @param $callback
     *
     * @return $this
     */
    public function registerModifier($name, $callback)
    {
        $this->modifiers[$name] = $callback;

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
        foreach ($modifiers as $name => $callback) {
            $this->registerModifier($name, $callback);
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