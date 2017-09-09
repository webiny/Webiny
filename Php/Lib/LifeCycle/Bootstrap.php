<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\LifeCycle;

use Apps\Webiny\Php\Lib\Response\HtmlResponse;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Apps\Webiny\Php\Lib\Apps\App;

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
     * @param App $app Instance of Apps\App being run
     */
    public function run(App $app)
    {
        // Override to implement
    }

    /**
     * Add an app route and a template that will be rendered for that route.<br/>
     *
     * @param string|\Closure $regex
     * @param string          $template
     * @param int             $priority
     * @param array|callable  $dataSource
     */
    protected function addAppRoute($regex, $template, $priority = 400, $dataSource = [])
    {
        $this->wEvents()->listen('Webiny.Bootstrap.Request', function () use ($regex, $template, $dataSource) {
            $path = $this->wRequest()->getCurrentUrl(true)->getPath(true);

            if (is_callable($regex) && !$regex($path)) {
                return null;
            }

            if (is_string($regex) && !$path->match($regex)) {
                return null;
            }

            return $this->renderApp($template, $dataSource);
        }, $priority);
    }

    private function renderApp($template, $dataSource)
    {
        $data = $dataSource;
        if (is_callable($dataSource)) {
            $data = $dataSource();
        }
        $html = $this->wTemplateEngine()->fetch($template, $data);

        return new HtmlResponse($html);
    }
}
