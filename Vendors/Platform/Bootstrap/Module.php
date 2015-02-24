<?php
namespace Webiny\Platform\Bootstrap;

use Webiny\Component\Config\ConfigObject;
use Webiny\Component\Config\ConfigTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Platform\Traits\PlatformTrait;

class Module
{
    use PlatformTrait, StdLibTrait, ConfigTrait;

    /**
     * @var ConfigObject
     */
    protected $_config;
    protected $_modulePath;

    public function __construct(ConfigObject $config, $modulePath)
    {
        $this->_config = $config;
        $this->_modulePath = $modulePath;
    }

    public function getName()
    {
        return $this->_config->get('Module.Name');
    }

    public function getConfig($key = null)
    {
        if ($key) {
            return $this->_config->get($key);
        }

        return $this->_config;
    }

    public function isActive()
    {
        return $this->_config->get('Module.Active', false);
    }

    public function getAbsolutePath()
    {
        return $this->_modulePath;
    }

    public function getTemplate($tpl)
    {
        return $this->getAbsolutePath() . '/Templates/' . $this->str($tpl)->trimLeft('/');
    }
}