<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Dispatchers;

use Apps\Webiny\Php\DevTools\Response\ApiRawResponse;
use Apps\Webiny\Php\Discover\Postman;
use Apps\Webiny\Php\RequestHandlers\ApiEvent;
use Apps\Webiny\Php\RequestHandlers\ApiException;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

class DiscoverDispatcher extends AbstractApiDispatcher
{
    public function handle(ApiEvent $event)
    {
        $apiUrl = $event->getUrl();
        if ($apiUrl->startsWith('/discover')) {

            if (!$this->wConfig()->get('Application.Acl.CheckUserPermissions', true)) {
                return $this->generatePostmanCollections($apiUrl);
            }

            $user = $this->wAuth()->getUser();
            if (!$user || !$user->hasRole('webiny-api-discoverer')) {
                $message = 'You are not authorized to discover the API';
                throw new ApiException($message, 'WBY-AUTHORIZATION', 401);
            }
        }
    }

    private function generatePostmanCollections(StringObject $apiUrl)
    {
        $app = $apiUrl->replace('/discover/', '')->pascalCase()->val();
        $docs = new Postman();

        return new ApiRawResponse($docs->generate($app));
    }
}