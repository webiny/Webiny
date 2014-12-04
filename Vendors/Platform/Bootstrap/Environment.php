<?php
namespace Webiny\Platform\Bootstrap;

use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Component\Config\ConfigTrait;
use Webiny\Component\Http\HttpTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;
use Webiny\Component\Storage\Driver\Local\Local;
use Webiny\Component\Storage\Storage;

class Environment
{
    use PlatformTrait, HttpTrait, StdLibTrait, ConfigTrait;

    private $_ip;
    private $_environment;

    /**
     * @var ArrayObject
     */
    private $_tags;

    public function __construct()
    {
        $this->_tags = new ArrayObject();

        /**
         * Load config files
         */
        $localDriver = new Local(__DIR__ . '/../../../Configs');
        $storage = new Storage($localDriver);

        $domains = $this->config()->yaml($storage->getContents('Domains.yaml'));
        $requestUrl = $this->httpRequest()->getHostName();
        $this->_ip = $this->httpRequest()->getClientIp();
        $domainConfig = $domains->get('Domains')[$requestUrl]->toArray(true);
        
        $config = $domainConfig->key($this->_ip, $domainConfig->key('all'), true);

        if($this->isString($config)){
            $this->_environment = $config;
        } else {
            $config = $this->arr($config);
            $this->_environment = $config['env'];
            $this->_tags = $this->arr($config->key('tags', $this->_tags, true));
        }
    }

    /**
     * Is given tag present in the loaded environment?
     * @param $tag
     *
     * @return bool
     */
    public function hasTag($tag){
        return $this->_tags->inArray($tag);
    }

    /**
     * Get environment: Local, Development, Staging, Production
     * @return string
     */
    public function getName(){
        return $this->_environment;
    }


    /**
     * Get request IP address
     *
     * @return string
     */
    public function getIpAddress(){
        return $this->_ip;
    }

    public function isLocal()
    {
        return $this->_environment == 'Local';
    }

    /**
     * Is this a development environment
     * @return bool
     */
    public function isDevelopment()
    {
        $devEnvs = $this->arr([
                                  'Local',
                                  'Development'
                              ]);

        return $devEnvs->inArray($this->_environment);
    }

    /**
     * Is this a staging environment
     * @return bool
     */
    public function isStaging()
    {
        return $this->_environment == 'Staging';
    }

    /**
     * Is this a production environment
     * @return bool
     */
    public function isProduction()
    {
        return $this->_environment == 'Production';
    }
}