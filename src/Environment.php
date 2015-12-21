<?php
namespace Webiny\Core;

use Webiny\Component\StdLib\StdObject\UrlObject\UrlObject;
use Webiny\Core\Traits\PlatformTrait;
use Webiny\Component\Http\HttpTrait;
use Webiny\Component\StdLib\StdLibTrait;

class Environment
{
    use PlatformTrait, HttpTrait, StdLibTrait;

    private $environment;

    public function __construct(UrlObject $requestUrl)
    {
        /**
         * Load config
         */
        $configPath = $this->getPlatform()->getRootDir() . '/Configs/Domains/' . $requestUrl->getHost() . '/Base.yaml';
        $this->config = $this->config()->yaml($configPath);
        $this->environment = $this->config->get('Platform.Environment');
    }

    /**
     * Get environment: Local, Development, Staging, Production
     * @return string
     */
    public function getName()
    {
        return $this->environment;
    }

    /**
     * @return \Webiny\Component\Config\ConfigObject
     */
    public function getConfig()
    {
        return $this->config;
    }

    public function isProduction()
    {
        return $this->getName() == 'Production';
    }

    public function isStaging()
    {
        return $this->getName() == 'Staging';
    }

    public function isDevelopment()
    {
        return $this->getName() == 'Development';
    }

    public function isLocal()
    {
        return $this->getName() == 'Local';
    }
}