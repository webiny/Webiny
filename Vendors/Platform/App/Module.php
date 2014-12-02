<?php
namespace Platform\App;

use Platform\Traits\AppTrait;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\Config\ConfigTrait;
use Webiny\Component\Http\HttpTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;
use Webiny\Component\Storage\Driver\Local\Local;
use Webiny\Component\Storage\Storage;

class Module
{
    use AppTrait, StdLibTrait, ConfigTrait;

    /**
     * @var ConfigObject
     */
    protected $_config;
    protected $_modulePath;

    public function __construct(ConfigObject $config, $modulePath){
        $this->_config = $config;
        $this->_modulePath = $modulePath;
    }

    public function getName(){
        return $this->_config->get('Module.Name');
    }

    public function isActive(){
        return $this->_config->get('Module.Active', false);
    }

    public function getAbsolutePath(){
        return $this->_modulePath;
    }
}