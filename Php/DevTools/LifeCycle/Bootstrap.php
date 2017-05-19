<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools\LifeCycle;

use Apps\Core\Php\DevTools\Response\HtmlResponse;
use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\PackageManager\App;

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
     * @param App $app Instance of PackageManager\App being run
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
        $this->wEvents()->listen('Core.Bootstrap.Request', function () use ($regex, $template, $dataSource) {
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
