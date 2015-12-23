<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\DevTools;

use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\TemplateEngine\TemplateEngineTrait;

/**
 * Class that provides access to template engine
 */
class TemplateEngine
{
    use SingletonTrait, TemplateEngineTrait;

    /**
     * @var \Webiny\Component\TemplateEngine\Bridge\TemplateEngineInterface
     */
    static private $templateEngine;

    protected function init()
    {
        /**
         * Set TemplateEngine config to framework component
         */
        $templateEngineConfig = Config::getInstance()->getConfig()->get('TemplateEngine', '');
        \Webiny\Component\TemplateEngine\TemplateEngine::setConfig($templateEngineConfig);

        /**
         * Get TemplateEngine instance
         */
        self::$templateEngine = $this->templateEngine('Smarty');

        /**
         * @TODO: Add registration of template engine plugins from apps and plugins
         */
    }

    /**
     * @return \Webiny\Component\TemplateEngine\Bridge\TemplateEngineInterface
     */
    public function getTemplateEngine()
    {
        return self::$templateEngine;
    }

}