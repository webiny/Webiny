<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib;

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
    public function append($resource)
    {
        self::$config->mergeWith($this->yaml($resource));
    }

    /**
     * Parses and returns the config without appending it to the global configuration.
     *
     * @param string $resource Path to the config file, can be relative to app root or absolute path.
     *
     * Ex1 - path relative to the app root: Configs/Environments.yaml
     * Ex2 - absolute path: /my/app/Configs/Environments.yaml
     *
     * @return ConfigObject
     */
    public function yaml($resource)
    {
        $projectRoot = realpath(self::$config->get('Webiny.AbsolutePath'));
        if (strpos($resource, $projectRoot) === false) {
            $resource = Storage::getInstance()->getPath($resource);
        }

        return self::$configReader->yaml($resource);
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
     * Replace current configuration with the new ConfigObject
     *
     * @param ConfigObject $config
     *
     * @return $this
     */
    public function setConfig(ConfigObject $config)
    {
        self::$config = $config;

        return $this;
    }
}