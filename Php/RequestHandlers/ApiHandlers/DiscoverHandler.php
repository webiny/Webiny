<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\RequestHandlers\ApiHandlers;

use Apps\Webiny\Php\Lib\Response\ApiRawResponse;
use Apps\Webiny\Php\RequestHandlers\ApiEvent;
use Apps\Webiny\Php\RequestHandlers\ApiException;
use Apps\Webiny\Php\RequestHandlers\ApiHandlers\Discover\Postman;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

class DiscoverHandler extends AbstractApiHandler
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

            return $this->generatePostmanCollections($apiUrl);
        }
    }

    private function generatePostmanCollections(StringObject $apiUrl)
    {
        $app = $apiUrl->replace('/discover/', '')->pascalCase()->val();
        $docs = new Postman();

        return new ApiRawResponse($docs->generate($app));
    }
}