<?php
namespace Apps\Core\Php\Discover\Parser;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Webiny\Component\Entity\Attribute\AttributeAbstract;
use Webiny\Component\Entity\Attribute\AttributeType;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;
use Webiny\Component\Storage\File\File;

class EntityParser
{
    use DevToolsTrait, StdLibTrait;

    /**
     * @var AppParser
     */
    private $app;
    private $class;
    private $name;
    private $slug;
    private $url;
    private $apiMethods;
    private $defaultValues;

    private $paramId;
    private $headerAuthorizationToken;

    function __construct(AppParser $app, $entity)
    {
        $this->app = $app;
        $this->class = $entity;
        $this->name = $this->str($entity)->explode('\\')->last()->val();
        $this->slug = $this->str($this->name)->kebabCase()->pluralize()->val();
        $this->url = '/entities/' . $app->getSlug() . '/' . $this->slug;
        $this->defaultValues = [
            'object'   => new \stdClass(),
            'array'    => '',
            'date'     => $this->datetime()->format('Y-m-d'),
            'datetime' => $this->datetime()->format('Y-m-d H:i:s'),
            'id'       => (string)new \MongoId(),
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

    /**
     * @return AppParser
     */
    public function getApp()
    {
        return $this->app;
    }

    /**
     * @return mixed
     */
    public function getClass()
    {
        return $this->class;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return mixed
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
     * @return mixed
     */
    public function getUrl()
    {
        return $this->url;
    }

    public function getRequiredAttributes()
    {
        $required = [];

        /* @var $entity EntityAbstract */
        $entity = new $this->class;

        /* @var $attr AttributeAbstract */
        foreach ($entity->getAttributes() as $name => $attr) {
            $validators = [];
            foreach ($attr->getValidators() as $v) {
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
        }

        return $required;
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

    private function getCrudList()
    {
        return [
            'path'        => $this->url,
            'name' => 'List ' . $this->str($this->name)->pluralize(),
            'method'      => 'GET',
            'parameters'  => [
                $this->headerAuthorizationToken
            ],
            'headers'     => [
                $this->headerAuthorizationToken
            ],
            'tests'       => [
                'var jsonData = JSON.parse(responseBody);',
                'tests["Status code is 200"] = responseCode.code === 200;',
                'tests["Meta exists"] = jsonData.data !== undefined && jsonData.data.meta instanceof Object;',
                'tests["List exists"] = jsonData.data !== undefined && jsonData.data.list instanceof Array;'
            ]
        ];
    }

    private function getCrudGet()
    {
        return [
            'path'        => $this->url . '/{id}',
            'name' => 'Get a single ' . $this->name . ' by ID',
            'method'      => 'GET',
            'parameters'  => [
                $this->paramId
            ],
            'headers'     => [
                $this->headerAuthorizationToken
            ]
        ];
    }

    private function getCrudCreate()
    {
        return [
            'path'        => $this->url,
            'name' => 'Create a ' . $this->name,
            'method'      => 'POST',
            'parameters'  => [],
            'headers'     => [
                $this->headerAuthorizationToken
            ],
            'body'        => $this->getRequiredAttributes()
        ];
    }

    private function getCrudUpdate()
    {
        return [
            'path'        => $this->url . '/{id}',
            'name' => 'Update a single ' . $this->name,
            'method'      => 'PATCH',
            'parameters'  => [
                $this->paramId
            ],
            'headers'     => [
                $this->headerAuthorizationToken
            ],
            'body'        => $this->getRequiredAttributes()
        ];
    }

    private function getCrudDelete()
    {
        return [
            'path'        => $this->url . '/{id}',
            'name' => 'Delete a single ' . $this->name . ' by ID',
            'method'      => 'DELETE',
            'parameters'  => [
                $this->paramId
            ],
            'headers'     => [
                $this->headerAuthorizationToken
            ]
        ];
    }

    /**
     * Recursively parse entity classes to find all methods exposed to API
     */
    private function getCustomMethods()
    {
        $apiDocs = $this->parseEntityApi($this->class);
        $methods = [];
        foreach ($apiDocs as $name => $httpMethods) {
            foreach ($httpMethods as $httpMethod => $config) {
                $config = $this->arr($config);
                $definition = [
                    'path'        => $this->url . $config['url'],
                    'name'        => $config->key('name'),
                    'description' => $config->key('description', '', true),
                    'method'      => $httpMethod,
                ];
                foreach ($config['path'] as $pName => $pConfig) {
                    $definition['parameters'][$pName] = [
                        'name'        => $pName,
                        'in'          => 'path',
                        'description' => $pConfig['description'],
                        'type'        => $pConfig['type'],
                        'required'    => true // TODO
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

                $methods[$name . '.' . $httpMethod] = $definition;
            }
        }

        return $methods;
    }

    /**
     * Parse entity class
     *
     * @param $class
     *
     * @return array
     * @throws \Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObjectException
     * @throws \Webiny\Component\StdLib\StdObject\StringObject\StringObjectException
     */
    private function parseEntityApi($class)
    {
        try {
            $reflectionClass = new \ReflectionClass($class);
            $method = $reflectionClass->getMethod('entityApi');
        } catch (\ReflectionException $e) {
            return [];
        }

        $startLine = $method->getStartLine() + 1;
        $endLine = $method->getEndLine() - 1;

        $storage = $this->wStorage('Root');
        $classPath = $this->str($class)->explode('\\')->filter();
        $classFile = $this->wApps($classPath[1])->getPath(false) . '/' . $classPath->slice(2)->implode('\\')->replace('\\', '/');

        $classFile = new File($classFile . '.php', $storage);
        $classContents = $classFile->getContents();
        $classLines = $this->str($classContents)->explode("\n");

        $entityApiLines = $classLines->slice($startLine, $endLine - $startLine, false);

        $apiDocs = [];
        $tmpDoc = $this->arr();
        foreach ($entityApiLines as $line => $code) {
            $code = $this->str($code)->trim();
            if ($code->trim()->val() == 'parent::entityApi();') {
                $parentClass = $reflectionClass->getParentClass()->getName();
                $parentApi = $this->parseEntityApi($parentClass);
                foreach ($parentApi as $key => $api) {
                    if (!array_key_exists($key, $apiDocs)) {
                        $apiDocs[$key] = $api;
                    }
                }
            }

            if ($code->startsWith('/*') || $code->endsWith('*/')) {
                continue;
            }

            if ($code->startsWith('$this->api(')) {
                $match = $code->match('\'(\w+)\',\s?\'(\w+)\'');
                $httpMethod = strtoupper($match->keyNested('1.0'));
                $methodName = $match->keyNested('2.0');
                if ($methodName) {
                    $apiDocs[$methodName][$httpMethod] = $tmpDoc->val();
                }
                $tmpDoc = $this->arr();
                continue;
            }

            if ($code->startsWith('* @api')) {
                $annotationLine = $code->replace('* @api.', '')->explode(' ', 2)->val();
                $line = $this->str($annotationLine[0]);
                // Parse parameters and fetch the appropriate value for given parameter type
                if ($line->startsWith('body.') || $line->startsWith('path.') || $line->startsWith('headers.')) {
                    $paramLine = $this->str($annotationLine[1])->explode(' ', 2);
                    $param = [
                        'type'        => $paramLine[0],
                        'value'       => $this->defaultValues[$paramLine[0]],
                        'name'        => $line->replace(['body.', 'path.'], '')->val(),
                        'description' => $paramLine[1]
                    ];

                    // TODO: add check if this parameter is 'required'

                    $tmpDoc->keyNested($annotationLine[0], $param);
                    continue;
                }
                $tmpDoc->keyNested($annotationLine[0], $annotationLine[1]);
            }
        }

        return $apiDocs;
    }
}
