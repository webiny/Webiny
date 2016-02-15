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

    private $app;
    private $appVersion;
    private $appSlug;
    private $entityClass;
    private $entityName;
    private $entitySlug;
    private $entityUrl;
    private $entityApiMethods;

    function __construct($app, $entity)
    {
        $this->app = $app;
        $this->appSlug = $this->str($app)->kebabCase()->val();
        $this->appVersion = $this->wApps($app)->getVersion();
        $this->entityClass = $entity;
        $this->entityName = $this->str($entity)->explode('\\')->last()->val();
        $this->entitySlug = $this->str($this->entityName)->kebabCase()->pluralize()->val();
        $this->entityUrl = '/entities/' . $this->appSlug . '/' . $this->entitySlug;
    }

    /**
     * @return mixed
     */
    public function getApp()
    {
        return $this->app;
    }

    /**
     * @return mixed
     */
    public function getAppSlug()
    {
        return $this->appSlug;
    }

    /**
     * @return mixed|string|\Webiny\Component\Config\ConfigObject
     */
    public function getAppVersion()
    {
        return $this->appVersion;
    }

    /**
     * @return mixed
     */
    public function getEntityClass()
    {
        return $this->entityClass;
    }

    /**
     * @return mixed
     */
    public function getEntityName()
    {
        return $this->entityName;
    }

    /**
     * @return mixed
     */
    public function getEntitySlug()
    {
        return $this->entitySlug;
    }

    /**
     * @return mixed
     */
    public function getEntityUrl()
    {
        return $this->entityUrl;
    }

    public function getRequiredEntityAttributes()
    {
        $required = [];

        /* @var $entity EntityAbstract */
        $entity = new $this->entityClass;

        /* @var $attr AttributeAbstract */
        foreach ($entity->getAttributes() as $name => $attr) {
            $validators = [];
            foreach ($attr->getValidators() as $v) {
                $parts = $this->str($v)->explode(':');
                $key = $parts[0];
                $validators[$key] = $parts->slice(1, null, false);
            }

            if ($attr->isRequired()) {
                switch (true) {
                    case $this->isInstanceOf($attr, AttributeType::OBJECT):
                        $value = new \stdClass();
                        break;
                    case $this->isInstanceOf($attr, AttributeType::ARR):
                        $value = [];
                        break;
                    case $this->isInstanceOf($attr, AttributeType::DATE):
                        $value = $this->datetime()->format('Y-m-d');
                        break;
                    case $this->isInstanceOf($attr, AttributeType::DATE_TIME):
                        $value = $this->datetime()->format('Y-m-d H:i:s');
                        break;
                    case $this->isInstanceOf($attr, AttributeType::MANY2ONE):
                        $value = (string)new \MongoId();
                        break;
                    case $this->isInstanceOf($attr, AttributeType::BOOLEAN):
                        $value = true;
                        break;
                    case $this->isInstanceOf($attr, AttributeType::CHAR):
                        $value = '';
                        if (array_key_exists('in', $validators)) {
                            $value = $validators['in']->implode('|')->val();
                        }
                        break;
                    default:
                        $value = '';
                }
                $required[$name] = $value;
            }
        }

        return $required;
    }

    public function getEntityApiMethods()
    {
        if (!$this->entityApiMethods) {
            $this->entityApiMethods = [
                'crudList'   => $this->getCrudList(),
                'crudGet'    => $this->getCrudGet(),
                'crudCreate' => $this->getCrudCreate(),
                'crudUpdate' => $this->getCrudUpdate(),
                'crudDelete' => $this->getCrudDelete()
            ];
        }

        return $this->entityApiMethods;
    }

    private function getCrudList()
    {
        return [
            'path'        => $this->entityUrl,
            'summary'     => 'List',
            'description' => 'List ' . $this->str($this->entityName)->pluralize(),
            'method'      => 'GET',
            'parameters'  => []
        ];
    }

    private function getCrudGet()
    {
        return [
            'path'        => $this->entityUrl . '/{{id}}',
            'summary'     => 'Get One',
            'description' => 'Get a single ' . $this->entityName . ' by ID',
            'method'      => 'GET',
            'parameters'  => [
                [
                    'name'        => 'id',
                    'in'          => 'path',
                    'description' => 'Mongo ID of ' . $this->entityName,
                    'type'        => 'string',
                    'required'    => true
                ]
            ]
        ];
    }

    private function getCrudCreate()
    {
        return [
            'path'        => $this->entityUrl,
            'summary'     => 'Create',
            'description' => 'Create a ' . $this->entityName,
            'method'      => 'POST',
            'parameters'  => [
                [
                    'name'        => 'body',
                    'in'          => 'body',
                    'description' => $this->entityName . ' to create in the system',
                    'required'    => true,
                    'structure'   => $this->getRequiredEntityAttributes()
                ]
            ]
        ];
    }

    private function getCrudUpdate()
    {
        return [
            'path'        => $this->entityUrl . '/{{id}}',
            'summary'     => 'Update',
            'description' => 'Update a signle ' . $this->entityName,
            'method'      => 'PATCH',
            'parameters'  => [
                [
                    'name'        => 'id',
                    'in'          => 'path',
                    'description' => 'Mongo ID of ' . $this->entityName,
                    'type'        => 'string',
                    'required'    => true
                ],
                [
                    'name'        => 'body',
                    'in'          => 'body',
                    'description' => $this->entityName . ' to update',
                    'required'    => true,
                    'structure'   => $this->getRequiredEntityAttributes() // TODO: add possibility to list optional attributes
                ]
            ]
        ];
    }

    private function getCrudDelete()
    {
        return [
            'path'        => $this->entityUrl . '/{{id}}',
            'summary'     => 'Delete One',
            'description' => 'Delete a single ' . $this->entityName . ' by ID',
            'method'      => 'DELETE',
            'parameters'  => [
                [
                    'name'        => 'id',
                    'in'          => 'path',
                    'description' => 'Mongo ID of ' . $this->entityName,
                    'type'        => 'string',
                    'required'    => true
                ]
            ]
        ];
    }

    private function getCustomMethods()
    {
        $class = new \ReflectionClass($this->entityClass);
        $method = $class->getMethod('entityApi');
        $startLine = $method->getStartLine() + 1;
        $endLine = $method->getEndLine() - 1;

        $storage = $this->wStorage('Root');

        $classFile = new File($this->str($this->entityClass)->replace('\\', '/')->append('.php'), $storage);
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
