<?php

namespace Apps\Webiny\Php\Services;

use Apps\Webiny\Php\DevTools\Exceptions\AppException;
use Apps\Webiny\Php\DevTools\Response\ApiRawResponse;
use Apps\Webiny\Php\DevTools\Response\ApiResponse;
use Apps\Webiny\Php\DevTools\Services\AbstractService;
use Apps\Webiny\Php\Entities\User;

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
            header('X-Accel-Buffering: no');
            ob_end_flush();

            $commands = [
                'mkdir -p /var/www/Marketplace',
                'cd /var/www/Marketplace',
                'echo "Installing Webiny app..."',
                // Composer is writing info messages to stderr so we redirect it to have all info in stdout pipe
                'composer require webiny/static-render 2>&1',
                'php ./Apps/Webiny/Php/Cli/install.php Local StaticRender',
            ];
            $pipes = [];
            $descriptor = [['pipe', 'r'], ['pipe', 'w'], ['pipe', 'w']];
            $proc = proc_open($this->generateCommand($commands), $descriptor, $pipes);
            fclose($pipes[0]);
            if (is_resource($proc)) {
                echo '<pre>';
                while ($f = fgets($pipes[1])) {
                    echo $f;
                    flush();
                }
                fclose($pipes[1]);

                while ($f = fgets($pipes[2])) {
                    echo $f;
                    flush();
                };
                proc_close($proc);
                echo '</pre>';
            }
            die();
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

    private function generateCommand($commands)
    {
        $connection = 'ssh -i ' . __DIR__ . '/file.rsa -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no vagrant@localhost';

        return $connection . ' "' . join(' && ', $commands) . '"';
    }
}