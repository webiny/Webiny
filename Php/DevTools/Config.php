<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\DevTools;

use Webiny\Component\Config\ConfigObject;
use Webiny\Component\StdLib\SingletonTrait;

/**
 * Class that holds the system configuration.
 */
class Config
{
    use SingletonTrait;

    /**
     * @var ConfigLoader
     */
    static private $configReader;

    /**
     * @var ConfigObject
     */
    static private $config;

    /**
     * Initialize the Config
     */
    protected function init()
    {
        // create config reader instance
        self::$configReader = ConfigLoader::getInstance();

        // create initial config instance
        self::$config = new ConfigObject([]);
    }

    /**
     * Append a configuration file. Must be in YAML format.
     *
     * @param string $resource Path to the config file, should be relative to app root.
     */
    public function appendConfig($resource)
    {
        self::$config->mergeWith($this->parseConfig($resource));
    }

    /**
     * Parses and returns the config without appending it to the global configuration.
     *
     * @param string $resource Path to the config file, should be relative to app root.
     *
     * @return ConfigObject
     */
    public function parseConfig($resource)
    {
        return self::$configReader->yaml(Storage::getInstance()->getPath($resource));
    }

    /**
     * Returns the value for the given config name. The name can have a dot, which defines depth levels.
     *
     * @param string $name
     * @param null   $default
     *
     * @return mixed|ConfigObject
     */
    public function get($name, $default = null)
    {
        return self::$config->get($name, $default);
    }

    /**
     * Returns the whole global configuration.
     *
     * @return ConfigObject
     */
    public function getConfig()
    {
        return self::$config;
    }

    /**
     * Magic get method, so you don't need to use the defined get method.
     *
     * @param $name
     *
     * @return mixed|ConfigObject
     */
    public function _get($name)
    {
        return $this->get($name);
    }

}