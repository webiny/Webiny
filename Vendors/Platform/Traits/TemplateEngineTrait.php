<?php
namespace Webiny\Platform\Traits;

use Webiny\Platform\Tools\TemplateEngine;
use Webiny\Component\ServiceManager\ServiceManager;

trait TemplateEngineTrait
{
    /**
     * @return TemplateEngine
     *
     * @throws \Webiny\Component\ServiceManager\ServiceManagerException
     */
    protected static function templateEngine()
    {
        return ServiceManager::getInstance()->getService('Smarty');
    }
}