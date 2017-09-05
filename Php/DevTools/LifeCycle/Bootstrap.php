<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\DevTools\LifeCycle;

use Apps\Webiny\Php\DevTools\Response\HtmlResponse;
use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\AppManager\App;

/**
 * Class Bootstrap
 *
 * This class contains a few helper methods to simplify app bootstrap
 */
class Bootstrap implements LifeCycleInterface
{
    use WebinyTrait;

    /**
     * Run the app
     *
     * @param App $app Instance of AppManager\App being run
     */
    public function run(App $app)
    {
        // Override to implement
    }

    /**
     * Add an app route and a template that will be rendered for that route.<br/>
     *
     * @param string         $regex
     * @param string         $template
     * @param int            $priority
     * @param array|callable $dataSource
     */
    protected function addAppRoute($regex, $template, $priority = 400, $dataSource = [])
    {
        $this->wEvents()->listen('Webiny.Bootstrap.Request', function () use ($regex, $template, $dataSource) {
            if ($this->wRequest()->getCurrentUrl(true)->getPath(true)->match($regex)) {
                $data = $dataSource;
                if (is_callable($dataSource)) {
                    $data = $dataSource();
                }
                $html = $this->wTemplateEngine()->fetch($template, $data);

                return new HtmlResponse($html);
            }
        }, $priority);
    }
}
