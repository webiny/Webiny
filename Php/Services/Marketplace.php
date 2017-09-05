<?php

namespace Apps\Webiny\Php\Services;

use Apps\Webiny\Php\DevTools\Exceptions\AppException;
use Apps\Webiny\Php\DevTools\Response\ApiRawResponse;
use Apps\Webiny\Php\DevTools\Response\ApiResponse;
use Apps\Webiny\Php\DevTools\Services\AbstractService;
use Apps\Webiny\Php\Entities\User;
use Apps\Webiny\Php\Services\Lib\AppInstaller;

/**
 * Class Marketplace
 * @package Apps\Webiny\Php\Services
 */
class Marketplace extends AbstractService
{
    function __construct()
    {
        parent::__construct();

        $this->api('GET', 'me', function () {
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

        $this->api('GET', 'apps', function () {
            $response = $this->server('/services/marketplace-manager/marketplace/apps');

            return new ApiRawResponse($response);
        });

        $this->api('GET', 'apps/{id}', function ($id) {
            $response = $this->server('/services/marketplace-manager/marketplace/apps/' . $id);

            return new ApiRawResponse($response);
        });

        $this->api('GET', 'apps/{id}/install', function ($id) {
            // Get app data from Webiny Marketplace
            $response = $this->server('/services/marketplace-manager/marketplace/apps/' . $id);
            $app = $this->arr(json_decode($response, true));

            if (!$app->keyExistsNested('data.entity.id')) {
                throw new AppException('Requested app was not found');
            }

            // Begin installation
            header("X-Accel-Buffering: no");
            ob_end_flush();
            $appInstaller = new AppInstaller();
            $appInstaller->setPrivateKey(__DIR__ . '/file.rsa');
            $appInstaller->install($app->keyNested('data.entity'));
            die(json_encode(['message' => 'Finished!']));
        })->setPublic();

        $this->api('POST', 'login', function () {
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

        $this->api('POST', 'reset-password', function () {
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