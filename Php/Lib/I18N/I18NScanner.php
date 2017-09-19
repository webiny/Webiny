<?php

namespace Apps\Webiny\Php\Lib\I18N;

use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\I18N\I18NParser\JsParser;
use Apps\Webiny\Php\Lib\I18N\I18NParser\PhpParser;
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
class I18NScanner
{
    use StdLibTrait, WebinyTrait, SingletonTrait;

    /**
     * Scans given apps for i18n usages (both PHP and JS code).
     *
     * @param array $list
     *
     * @return array
     */
    public function scanApps(array $list)
    {
        $return = [];

        // Normalize list of apps.
        $list = array_map(function ($app) {
            return is_string($app) ? self::wApps($app) : $app;
        }, $list);

        // Parse one-by-one.
        foreach ($list as $app) {
            /* @var App $app */
            $return[] = self::getInstance()->scanApp($app);
        }

        return $return;
    }

    /**
     * Scans given app for i18n usages (both PHP and JS code).
     *
     * @param App $app
     *
     * @return I18NAppTexts
     */
    public function scanApp(App $app)
    {
        $texts = array_merge(PhpParser::getInstance()->parse($app), JsParser::getInstance()->parse($app));

        return new I18NAppTexts($app, $texts);
    }
}