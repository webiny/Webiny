<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Dispatchers;

use Apps\Core\Php\DevTools\Response\ApiRawResponse;
use Apps\Core\Php\Discover\Postman;
use Apps\Core\Php\RequestHandlers\ApiEvent;

class DiscoverDispatcher extends AbstractApiDispatcher
{
    public function handle(ApiEvent $event)
    {
        $apiUrl = $event->getUrl();
        if ($apiUrl->startsWith('/discover')) {
            // TODO: create an API Discoverer role to be inserted during system installation
            /*$user = $this->wAuth()->getUser();
            if (!$user->hasRole('api-discoverer')) {
                $message = 'You are not authorized to discover API';
                throw new ApiException($message, 'WBY-AUTHORIZATION', 401);
            }*/
            $app = $apiUrl->replace('/discover/', '')->pascalCase()->val();
            $docs = new Postman();

            return new ApiRawResponse($docs->generate($app));
        }
    }
}