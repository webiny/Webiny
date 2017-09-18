<?php

namespace Apps\Webiny\Php\Services;

set_time_limit(0);

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\Response\ApiRawResponse;
use Apps\Webiny\Php\Lib\Response\ApiResponse;
use Apps\Webiny\Php\Lib\Services\AbstractService;
use Apps\Webiny\Php\Entities\User;
use Apps\Webiny\Php\Services\Lib\AppInstaller;
use Composer\Semver\Semver;

/**
 * Class Marketplace
 */
class Marketplace extends AbstractService
{
    protected static $classId = 'Webiny.Services.Marketplace';

    protected function serviceApi(ApiContainer $api)
    {
        // This service is only accessible in development
        if ($this->wIsProduction()) {
            return;
        }

        $api->get('me', function () {
            $response = $this->server('/entities/webiny/users/me');
            $resData = json_decode($response, true);

            if (array_key_exists('code', $resData)) {
                return new ApiRawResponse($response);
            }

            /* @var $user User */
            $user = $this->wAuth()->getUser();
            $data = [
                'authToken' => $user->meta['theHub']['token'],
                'user'      => $resData['data']
            ];

            return new ApiResponse($data);
        });

        $api->get('apps', function () {
            $response = $this->server('/services/marketplace-manager/marketplace/apps');
            $response = json_decode($response, true);

            // Check which apps are installed locally and add their version to the response
            $localApps = $this->wApps()->getInstalledApps();
            foreach ($response['data']['list'] as $index => $app) {
                $localName = $app['localName'];
                if (array_key_exists($localName, $localApps)) {
                    $response['data']['list'][$index]['installedVersion'] = $localApps[$localName]['Version'];
                }
            }

            return new ApiRawResponse($response);
        });

        $api->get('apps/{id}', function ($id) {
            $response = $this->server('/services/marketplace-manager/marketplace/apps/' . $id);
            $response = json_decode($response, true);
            $app = $response['data']['entity'];

            $localApps = $this->wApps()->getInstalledApps();
            $app['installedVersion'] = $localApps[$app['localName']]['Version'] ?? null;
            $app['installedWebinyVersion'] = $localApps['Webiny']['Version'];
            $app['canInstall'] = Semver::satisfies($localApps['Webiny']['Version'], $app['webinyVersion']);

            if ($app['version'] === $app['installedVersion']) {
                $app['canInstall'] = false;
            }

            $response['data']['entity'] = $app;

            return new ApiRawResponse($response);
        });

        $api->get('apps/{id}/install', function ($id) {
            // Get app data from Webiny Marketplace
            $response = $this->server('/services/marketplace-manager/marketplace/apps/' . $id);
            $app = $this->arr(json_decode($response, true));

            if (!$app->keyExistsNested('data.entity.id')) {
                throw new AppException('Requested app was not found');
            }


            $appInstaller = new AppInstaller($app->keyNested('data.entity'));
            $appInstaller->checkRequirements();

            // Begin installation
            header("X-Accel-Buffering: no");
            header("Content-Type: text/event-stream");
            header("Cache-Control: no-cache");
            ob_end_flush();

            try {
                $appInstaller->install();
                // After the app is installed, increment installations counter
                $this->server('/services/marketplace-manager/marketplace/apps/' . $id . '/installed', 'POST');
            } catch (AppException $e) {
                // Don't do anything, the message was already sent to browser.
            }

            die();
        });

        $api->post('login', function () {
            $data = $this->wRequest()->getRequestData();
            $data['rememberme'] = true;

            $response = $this->server('/entities/webiny/users/login', 'POST', $data);

            $response = json_decode($response, true);
            if (!isset($response['code'])) {
                /* @var $user User */
                $user = $this->wAuth()->getUser();
                $user->meta['theHub']['token'] = $response['data']['authToken'];
                $user->save();
            }

            return new ApiRawResponse($response);
        });

        $api->post('reset-password', function () {
            $data = $this->wRequest()->getRequestData();
            $response = $this->server('/entities/webiny/users/reset-password', 'POST', $data);

            return new ApiRawResponse($response);
        });
    }


    /**
     * Creates a request to the Issue Tracker Server and returns the response.
     *
     * @param        $path
     * @param string $requestType
     * @param array  $body
     *
     * @return null
     * @throws AppException
     */
    private function server($path, $requestType = 'GET', $body = [])
    {
        try {
            $curl = $this->getCurl();
            switch (strtoupper($requestType)) {
                case 'GET':
                    $curl->get($this->getEndpoint($path));
                    break;
                case 'POST':
                    $curl->post($this->getEndpoint($path), $body);
                    break;
            }

            return $curl->rawResponse;
        } catch (\Exception $e) {
            throw new AppException($e->getMessage());
        }
    }

    /**
     * Creates a Curl instance and populates it with required auth header
     *
     * @return \Curl\Curl
     * @throws AppException
     */
    private function getCurl()
    {
        $curl = new \Curl\Curl();

        /* @var $user User */
        $user = $this->wAuth()->getUser();
        $token = $user->meta['theHub']['token'] ?? null;
        $curl->setHeader('X-Webiny-Authorization', $token);

        return $curl;
    }

    /**
     * Creates a path to the required endpoint.
     *
     * @param string $path
     *
     * @return string
     * @throws AppException
     */
    private function getEndpoint($path)
    {
        $api = $this->wApps('Webiny')->getConfig()->get('Marketplace.Api', false);
        if (!$api) {
            throw new AppException('Marketplace.Api is not configured.');
        }

        if (strpos($path, '?') === false && $this->wRequest()->server()->queryString() != '') {
            $path .= '?' . $this->wRequest()->server()->queryString();
        }

        return $api . $path;
    }
}