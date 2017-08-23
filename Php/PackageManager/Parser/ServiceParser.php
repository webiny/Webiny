<?php
namespace Apps\Webiny\Php\PackageManager\Parser;

use Apps\Webiny\Php\DevTools\Services\AbstractService;

class ServiceParser extends AbstractParser
{
    protected $baseClass = 'Apps\Webiny\Php\DevTools\Services\AbstractService';
    protected $publicApiInterface;

    function __construct($class)
    {
        parent::__construct($class);
        $this->url = '/services/' . $this->getAppSlug() . '/' . $this->slug;

        $interfaces = class_implements($class);
        $this->publicApiInterface = in_array('Apps\Webiny\Php\DevTools\Interfaces\PublicApiInterface', $interfaces);
    }

    public function getApiMethods()
    {
        $apiDocs = $this->parseApi($this->class);
        $methods = [];
        /* @var $serviceInstance AbstractService */
        $serviceInstance = new $this->class;
        foreach ($apiDocs as $name => $httpMethods) {
            foreach ($httpMethods as $httpMethod => $config) {
                $config = $this->arr($config);
                $key = $name . '.' . $httpMethod;
                $definition = [
                    'key'           => $key,
                    'path'          => rtrim($this->url . '/' . ltrim($name, '/'), '/'),
                    'url'           => $this->wConfig()->get('Application.ApiPath') . rtrim($this->url . '/' . ltrim($name, '/'), '/'),
                    'name'          => $config->key('name', '', true),
                    'description'   => $config->key('description', '', true),
                    'method'        => strtoupper($httpMethod),
                    'public'        => false,
                    'authorization' => true,
                    'headers'       => []
                ];

                if ($this->publicApiInterface) {
                    $definition['public'] = true;
                    $definition['authorization'] = false;
                }

                // There may be a case when a developer uses a trait with extra api methods and parser registers those methods
                // but if those methods are not initialized, this following check may fail with an error.
                // To avoid it - we check if method is initialized before doing anything else.
                $serviceMethod = $serviceInstance->getApi()->getMethod($httpMethod, $name);
                if ($serviceMethod && !$this->publicApiInterface) {
                    $definition['public'] = $serviceMethod->getPublic();
                }

                if ($serviceMethod && !$this->publicApiInterface) {
                    $definition['authorization'] = !$definition['public'];
                }

                if ($definition['authorization']) {
                    $definition['headers'][] = $this->headerAuthorizationToken;
                }

                if (count($config['query']) > 0) {
                    $queryParams = http_build_query($config['query']);
                    $definition['path'] .= '?' . $queryParams;
                    $definition['url'] .= '?' . $queryParams;
                }

                // Build path, body and header parameters
                foreach ($config->key('path', [], true) as $pName => $pConfig) {
                    $definition['parameters'][] = [
                        'name'        => $pName,
                        'in'          => 'path',
                        'description' => $pConfig['description'],
                        'type'        => $pConfig['type']
                    ];
                }

                foreach ($config->key('body', [], true) as $pName => $pConfig) {
                    $definition['body'][] = [
                        'type'  => $pConfig['type'],
                        'value' => $pConfig['value'] ?? null
                    ];
                }
                foreach ($config->key('headers', [], true) as $pName => $pConfig) {
                    $definition['headers'][] = [
                        'name'        => $pName,
                        'description' => $pConfig['description'],
                        'type'        => $pConfig['type'],
                        'required'    => true
                    ];
                }

                $methods[] = $definition;
            }
        }

        return $methods;
    }
}
