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

    private $paramId;
    private $headerAuthorizationToken;

    function __construct(AppParser $app, $entity)
    {
        $this->app = $app;
        $this->class = $entity;
        $this->name = $this->str($entity)->explode('\\')->last()->val();
        $this->slug = $this->str($this->name)->kebabCase()->pluralize()->val();
        $this->url = '/entities/' . $app->getSlug() . '/' . $this->slug;

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
                        $attribute['value'] = new \stdClass();
                        break;
                    case $this->isInstanceOf($attr, AttributeType::ARR):
                        $attribute['type'] = 'array';
                        $attribute['value'] = [];
                        break;
                    case $this->isInstanceOf($attr, AttributeType::DATE):
                        $attribute['type'] = 'date';
                        $attribute['value'] = $this->datetime()->format('Y-m-d');
                        break;
                    case $this->isInstanceOf($attr, AttributeType::DATE_TIME):
                        $attribute['type'] = 'datetime';
                        $attribute['value'] = $this->datetime()->format('Y-m-d H:i:s');
                        break;
                    case $this->isInstanceOf($attr, AttributeType::MANY2ONE):
                        $attribute['type'] = 'string';
                        $attribute['value'] = (string)new \MongoId();
                        break;
                    case $this->isInstanceOf($attr, AttributeType::BOOLEAN):
                        $attribute['type'] = 'boolean';
                        $attribute['value'] = true;
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
        }

        return $this->apiMethods;
    }

    private function getCrudList()
    {
        return [
            'path'        => $this->url,
            'description' => 'List ' . $this->str($this->name)->pluralize(),
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
            'path'        => $this->url . '/{{id}}',
            'description' => 'Get a single ' . $this->name . ' by ID',
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
            'description' => 'Create a ' . $this->name,
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
            'path'        => $this->url . '/{{id}}',
            'description' => 'Update a single ' . $this->name,
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
            'path'        => $this->url . '/{{id}}',
            'description' => 'Delete a single ' . $this->name . ' by ID',
            'method'      => 'DELETE',
            'parameters'  => [
                $this->paramId
            ],
            'headers'     => [
                $this->headerAuthorizationToken
            ]
        ];
    }

    private function getCustomMethods()
    {
        $class = new \ReflectionClass($this->class);
        $method = $class->getMethod('entityApi');
        $startLine = $method->getStartLine() + 1;
        $endLine = $method->getEndLine() - 1;

        $storage = $this->wStorage('Root');

        $classFile = new File($this->str($this->class)->replace('\\', '/')->append('.php'), $storage);
        $classContents = $classFile->getContents();
        $classLines = $this->str($classContents)->explode("\n");

        $entityApiLines = $classLines->slice($startLine, $endLine - $startLine, false);

        $apiDocs = [];
        $tmpDoc = $this->arr();
        foreach ($entityApiLines as $line => $code) {
            $code = $this->str($code)->trim();
            if ($code->startsWith('/*') || $code->endsWith('*/')) {
                continue;
            }

            if ($code->startsWith('$this->api(')) {
                $methodName = $code->match('\'\w+\',\s?\'(\w+)\'')->keyNested('1.0');
                if ($methodName) {
                    $apiDocs[$methodName] = $tmpDoc->val();
                }
                $tmpDoc = $this->arr();
                continue;
            }

            if ($code->startsWith('* @api')) {
                $annotationLine = $code->trimLeft('* @api.')->explode(' ', 2)->val();
                $tmpDoc->keyNested($annotationLine[0], $annotationLine[1]);
            }
        }

        die(print_r($apiDocs));
    }
}
