<?php
namespace Apps\Core\Php\Discover\Parser;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Apps\Core\Php\DevTools\Exceptions\AppException;
use Apps\Core\Php\RequestHandlers\ApiException;
use Webiny\Component\Entity\Attribute\AbstractAttribute;
use Webiny\Component\Entity\Attribute\AttributeType;
use Webiny\Component\Mongo\MongoTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\StdObjectException;
use Webiny\Component\Storage\File\File;

class ServiceParser extends AbstractParser
{
    protected $baseClass = 'Apps\Core\Php\DevTools\Services\AbstractService';

    function __construct(AppParser $app, $service)
    {
        parent::__construct($app, $service);
        $this->url = '/services/' . $app->getSlug() . '/' . $this->slug;
    }

    public function getApiMethods()
    {
        $apiDocs = $this->parseApi($this->class);
        $methods = [];
        foreach ($apiDocs as $name => $httpMethods) {
            foreach ($httpMethods as $httpMethod => $config) {
                $config = $this->arr($config);
                $definition = [
                    'path'        => rtrim($this->url . '/' . ltrim($name, '/'), '/'),
                    'name'        => $config->key('name'),
                    'description' => $config->key('description', '', true),
                    'method'      => strtoupper($httpMethod),
                ];

                if (count($config['query']) > 0) {
                    $definition['path'] .= '?' . http_build_query($config['query']);
                }

                // Build path, body and header parameters
                foreach ($config['path'] as $pName => $pConfig) {
                    $definition['parameters'][$pName] = [
                        'name'        => $pName,
                        'in'          => 'path',
                        'description' => $pConfig['description'],
                        'type'        => $pConfig['type']
                    ];
                }

                foreach ($config['body'] as $pName => $pConfig) {
                    $definition['body'][$pName] = [
                        'type'  => $pConfig['type'],
                        'value' => $pConfig['value']
                    ];
                }
                foreach ($config['headers'] as $pName => $pConfig) {
                    $definition['headers'][$pName] = [
                        'name'        => $pName,
                        'description' => $pConfig['description'],
                        'type'        => $pConfig['type'],
                        'required'    => true
                    ];
                }

                $methods[$name . ' . ' . $httpMethod] = $definition;
            }
        }

        return $methods;
    }
}
