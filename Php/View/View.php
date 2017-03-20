<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\View;

use Apps\Core\Php\DevTools\WebinyTrait;
use Webiny\Component\Config\Config;
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
        return \Apps\Core\Php\DevTools\Config::getInstance();
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

        return $this->wConfig()->get('Application.WebPath') . $app->getBuildPath() . '_' . $parts[1] . '/' . ltrim($path, '/');
    }
}