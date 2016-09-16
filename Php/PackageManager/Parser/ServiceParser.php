<?php
namespace Apps\Core\Php\PackageManager\Parser;

class ServiceParser extends AbstractParser
{
    protected $baseClass = 'Apps\Core\Php\DevTools\Services\AbstractService';

    function __construct($class)
    {
        $this->public = $this->isInstanceOf(new $class, '\Apps\Core\Php\DevTools\Interfaces\PublicApiInterface');
        parent::__construct($class);
        $this->url = '/services/' . $this->getAppSlug() . '/' . $this->slug;

        $this->headerApiToken = [
            'name'        => 'X-Webiny-Api-Token',
            'description' => 'API token',
            'type'        => 'string',
            'required'    => true
        ];
    }

    public function getApiMethods()
    {
        $apiDocs = $this->parseApi($this->class);
        $methods = [];
        foreach ($apiDocs as $name => $httpMethods) {
            foreach ($httpMethods as $httpMethod => $config) {
                $config = $this->arr($config);
                $key = $name . '.' . $httpMethod;
                $definition = [
                    'key'         => $key,
                    'path'        => rtrim($this->url . '/' . ltrim($name, '/'), '/'),
                    'url'         => $this->wConfig()->get('Application.ApiPath') . rtrim($this->url . '/' . ltrim($name, '/'), '/'),
                    'name'        => $config->key('name', '', true),
                    'description' => $config->key('description', '', true),
                    'method'      => strtoupper($httpMethod),
                    'headers'     => []
                ];

                if (!$this->public) {
                    $definition['headers'][] = $this->headerApiToken;
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
