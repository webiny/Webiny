<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\View;

use Apps\Webiny\Php\Lib\Config;
use Apps\Webiny\Php\Lib\Request;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\StdLib\StdLibTrait;


class View
{
    use WebinyTrait, StdLibTrait;

    /**
     * Get access to system configuration
     *
     * @return Config
     */
    public static function wConfig()
    {
        return Config::getInstance();
    }

    /**
     * @return Request
     */
    public static function wRequest()
    {
        return Request::getInstance();
    }

    /**
     * Returns a path to the given file in given app. Only used for publicly exposed files (via 'public' folders).
     * @param $app
     * @param $path
     *
     * @return string
     */
    public function Assets($app, $path)
    {
        $parts = $this->str($app)->explode('.');
        $app = $this->wApps($parts[0]);

        return $this->wConfig()->get('Application.WebPath') . $app->getJsApps($parts[1])->getPublicAssetPath($path);
    }
}