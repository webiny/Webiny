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
class I18NParser
{
    use StdLibTrait, WebinyTrait, SingletonTrait;

    /**
     * Parses given apps
     *
     * @param array $list
     *
     * @return array
     */
    public function parseApps(array $list)
    {
        $return = [];

        // Normalize list of apps.
        $list = array_map(function ($app) {
            return is_string($app) ? self::wApps($app) : $app;
        }, $list);

        // Parse one-by-one.
        foreach ($list as $app) {
            /* @var App $app */
            $return[] = I18NParser::getInstance()->parseApp($app);
        }

        return $return;
    }

    public function parseApp(App $app)
    {
        $texts = array_merge(PhpParser::getInstance()->parse($app), JsParser::getInstance()->parse($app));

        return new I18NAppTexts($app, $texts);
    }
}