<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools;

use Apps\Core\Php\DevTools\Response\HtmlResponse;

/**
 * AppBootstrap class.
 *
 * This class contains a few
 *
 */
trait BootstrapTrait
{
    use DevToolsTrait;

    protected function addAppRoute($regex, $template, $priority = 400, $dataSource = null)
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
