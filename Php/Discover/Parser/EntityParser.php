<?php
namespace Apps\Core\Php\Discover\Parser;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Apps\Core\Php\DevTools\Exceptions\AppException;
use Apps\Core\Php\RequestHandlers\ApiException;
use Webiny\Component\Entity\Attribute\AttributeAbstract;
use Webiny\Component\Entity\Attribute\AttributeType;
use Webiny\Component\Mongo\MongoTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\StdObjectException;
use Webiny\Component\Storage\File\File;

class EntityParser extends AbstractParser
{
    protected $baseClass = 'Apps\Core\Php\DevTools\Entity\EntityAbstract';
    private $apiMethods;
    private $defaultValues;
    private $paramId;
    private $headerAuthorizationToken;

    function __construct(AppParser $app, $entity)
    {
        parent::__construct($app, $entity);
        $this->url = '/entities/' . $app->getSlug() . '/' . $this->slug;
        $this->defaultValues = [
            'object'   => new \stdClass(),
            'array'    => '',
            'date'     => $this->datetime()->format('Y-m-d'),
            'datetime' => $this->datetime()->format('Y-m-d H:i:s'),
            'id'       => (string)$this->mongo()->id(),
            'boolean'  => true,
            'string'   => ''
        ];

        $this->paramId = [
            'name'        => 'id',
            'in'          => 'path',
            'description' => 'Mongo ID of ' . $this->name,
            'type'        => 'string',
            'required'    => true
        ];

        $this->headerAuthorizationToken = [
            'name'        => 'Authorization',
            'description' => 'Authorization token',
            'type'        => 'string',
            'required'    => true
        ];
    }

    public function getApiMethods()
    {
        if (!$this->apiMethods) {
            $this->apiMethods = [
                'crudList'   => $this->getCrudList(),
                'crudGet'    => $this->getCrudGet(),
                'crudCreate' => $this->getCrudCreate(),
                'crudUpdate' => $this->getCrudUpdate(),
                'crudDelete' => $this->getCrudDelete()
            ];
            $customMethods = $this->getCustomMethods();
            $this->apiMethods = array_merge($this->apiMethods, $customMethods);
        }

        return $this->apiMethods;
    }

    public function getRequiredAttributes()
    {
        $required = [];

        /* @var $entity EntityAbstract */
        $entity = new $this->class;

        /* @var $attr AttributeAbstract */

        foreach ($entity->getAttributes() as $name => $attr) {
            try {
                $validators = [];
                foreach ($attr->getValidators() as $v) {
                    if (!is_string($v)) {
                        continue;
                    }
                    $parts = $this->str($v)->explode(':');
                    $key = $parts[0];
                    $validators[$key] = $parts->slice(1, null, false);
                }

                if ($attr->isRequired()) {
                    $attribute = ['type' => '', 'value' => ''];

                    switch (true) {
                        case $this->isInstanceOf($attr, AttributeType::OBJECT):
                            $attribute['type'] = 'object';
                            $attribute['value'] = $this->defaultValues['object'];
                            break;
                        case $this->isInstanceOf($attr, AttributeType::ARR):
                            $attribute['type'] = 'array';
                            $attribute['value'] = $this->defaultValues['array'];
                            break;
                        case $this->isInstanceOf($attr, AttributeType::DATE):
                            $attribute['type'] = 'date';
                            $attribute['value'] = $this->defaultValues['date'];
                            break;
                        case $this->isInstanceOf($attr, AttributeType::DATE_TIME):
                            $attribute['type'] = 'datetime';
                            $attribute['value'] = $this->defaultValues['datetime'];
                            break;
                        case $this->isInstanceOf($attr, AttributeType::MANY2ONE):
                            $attribute['type'] = 'string';
                            $attribute['value'] = $this->defaultValues['id'];
                            break;
                        case $this->isInstanceOf($attr, AttributeType::BOOLEAN):
                            $attribute['type'] = 'boolean';
                            $attribute['value'] = $this->defaultValues['boolean'];
                            break;
                        case $this->isInstanceOf($attr, AttributeType::CHAR):
                            $value = '';
                            if (array_key_exists('in', $validators)) {
                                $value = $validators['in']->implode('|')->val();
                            }
                            $attribute['type'] = 'string';
                            $attribute['value'] = $value;
                            break;
                        default:
                            $attribute['type'] = 'string';
                            $attribute['value'] = '';
                    }
                    $required[$name] = $attribute;
                }
            } catch (StdObjectException $e) {
                throw new AppException('Failed to read required attributes at ' . $name . ', in ' . get_class($entity));
            }
        }

        return $required;
    }

    private function getCrudList()
    {
        return [
            'path'       => $this->url,
            'name'       => 'List ' . $this->str($this->name)->pluralize(),
            'method'     => 'GET',
            'parameters' => [
                $this->headerAuthorizationToken
            ],
            'headers'    => [
                $this->headerAuthorizationToken
            ],
            'tests'      => [
                'var jsonData = JSON . parse(responseBody);',
                'tests["Status code is 200"] = responseCode . code === 200;',
                'tests["Meta exists"] = jsonData . data !== undefined && jsonData . data . meta instanceof Object;',
                'tests["List exists"] = jsonData . data !== undefined && jsonData . data . list instanceof Array;'
            ]
        ];
    }

    private function getCrudGet()
    {
        return [
            'path'       => $this->url . '/{id}',
            'name'       => 'Get a single ' . $this->name . ' by ID',
            'method'     => 'GET',
            'parameters' => [
                $this->paramId
            ],
            'headers'    => [
                $this->headerAuthorizationToken
            ]
        ];
    }

    private function getCrudCreate()
    {
        return [
            'path'       => $this->url,
            'name'       => 'Create a ' . $this->name,
            'method'     => 'POST',
            'parameters' => [],
            'headers'    => [
                $this->headerAuthorizationToken
            ],
            'body'       => $this->getRequiredAttributes()
        ];
    }

    private function getCrudUpdate()
    {
        return [
            'path'       => $this->url . '/{id}',
            'name'       => 'Update a single ' . $this->name,
            'method'     => 'PATCH',
            'parameters' => [
                $this->paramId
            ],
            'headers'    => [
                $this->headerAuthorizationToken
            ],
            'body'       => $this->getRequiredAttributes()
        ];
    }

    private function getCrudDelete()
    {
        return [
            'path'       => $this->url . '/{id}',
            'name'       => 'Delete a single ' . $this->name . ' by ID',
            'method'     => 'DELETE',
            'parameters' => [
                $this->paramId
            ],
            'headers'    => [
                $this->headerAuthorizationToken
            ]
        ];
    }

    /**
     * Recursively parse entity classes to find all methods exposed to API
     */
    private function getCustomMethods()
    {
        $apiDocs = $this->parseApi($this->class);
        $methods = [];
        foreach ($apiDocs as $name => $httpMethods) {
            foreach ($httpMethods as $httpMethod => $config) {
                $config = $this->arr($config);
                $definition = [
                    'path'        => $this->url . '/' . ltrim($name, '/'),
                    'name'        => $config->key('name'),
                    'description' => $config->key('description', '', true),
                    'method'      => strtoupper($httpMethod),
                ];

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
