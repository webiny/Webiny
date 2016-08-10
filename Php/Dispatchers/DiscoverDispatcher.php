<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Dispatchers;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Response\ApiRawResponse;
use Apps\Core\Php\Discover\Parser\AppParser;
use Apps\Core\Php\Discover\Postman;
use Apps\Core\Php\RequestHandlers\ApiEvent;

class DiscoverDispatcher extends AbstractApiDispatcher
{
    use WebinyTrait;

    public function handle(ApiEvent $event)
    {
        $apiUrl = $event->getUrl();
        if ($apiUrl->startsWith('/discover')) {
            $this->checkApiToken();
            $app = $apiUrl->replace('/discover/', '')->pascalCase()->val();
            $appParser = new AppParser($app);
            $docs = new Postman();

            return new ApiRawResponse($docs->generate($appParser));
        }
    }
}