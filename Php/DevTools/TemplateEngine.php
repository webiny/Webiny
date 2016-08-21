<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools;

use Apps\Core\Php\View\View;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\TemplateEngine\TemplateEngineTrait;

/**
 * Class that provides access to template engine
 */
class TemplateEngine
{
    use SingletonTrait, TemplateEngineTrait, StdLibTrait, WebinyTrait;

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

        self::$templateEngine->assign('Webiny', new View());
    }

    /**
     * @return \Webiny\Component\TemplateEngine\Bridge\TemplateEngineInterface
     */
    public function getTemplateEngine()
    {
        return self::$templateEngine;
    }

    /**
     * Set root template dir
     *
     * @param string $dir
     *
     * @return $this
     */
    public function setTemplateDir($dir)
    {
        self::$templateEngine->setTemplateDir($dir);

        return $this;
    }

    public function fetch($template, $parameters = [])
    {
        $template = $this->str($template);
        if ($template->contains(':') && !$template->startsWith('eval:')) {
            $parts = $template->explode(':');
            $template = $this->wApps($parts[0])->getPath() . '/' . $parts[1];
        }

        return self::$templateEngine->fetch((string)$template, $parameters);
    }
}