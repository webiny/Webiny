<?php
namespace Webiny\Platform\Builders\AssetBuilders;

use Webiny\Component\Config\ConfigObject;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;
use Webiny\Component\Storage\Storage;
use Webiny\Platform\Bootstrap\App;
use Webiny\Platform\Builders\CliLoggerTrait;
use Webiny\Platform\Traits\PlatformTrait;

abstract class AbstractAssetBuilder
{
    use StdLibTrait, PlatformTrait, CliLoggerTrait;

    const PRODUCTION = 1;
    const DEVELOPMENT = 2;

    /**
     * @var App
     */
    protected $_app;

    /**
     * @var Storage
     */
    protected $_storage;

    /**
     * @var ArrayObject
     */
    protected $_log;

    /**
     * @var ConfigObject
     */
    protected $_config;

    protected $_mode = self::DEVELOPMENT;

    abstract public function build();

    public function __construct(App $app, Storage $storage, ArrayObject $log, ConfigObject $config)
    {
        $this->_app = $app;
        $this->_storage = $storage;
        $this->_log = $log;
        $this->_config = $config;
    }

    public function setDevelopmentMode()
    {
        $this->_mode = self::DEVELOPMENT;

        return $this;
    }

    public function setProductionMode()
    {
        $this->_mode = self::PRODUCTION;

        return $this;
    }
}