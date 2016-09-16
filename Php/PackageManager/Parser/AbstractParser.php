<?php
namespace Apps\Core\Php\PackageManager\Parser;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Exceptions\AppException;
use Webiny\Component\Mongo\MongoTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\File\File;

abstract class AbstractParser
{
    use WebinyTrait, StdLibTrait, MongoTrait;

    protected $class;
    protected $name;
    protected $slug;
    protected $url;
    protected $baseClass;
    protected $queryParams = [];

    abstract public function getApiMethods();

    function __construct($class)
    {
        $this->class = $class;
        $this->name = $this->str($this->class)->explode('\\')->last()->val();
        $this->slug = $this->str($this->name)->kebabCase()->pluralize()->val();
    }

    public function getAppSlug()
    {
        $appName = $this->str($this->class)->explode('\\')[1];

        return $this->str($appName)->kebabCase()->val();
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

    /**
     * Parse entity class
     *
     * @param $class
     *
     * @return array
     * @throws AppException
     * @throws \Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObjectException
     * @throws \Webiny\Component\StdLib\StdObject\StringObject\StringObjectException
     */
    protected function parseApi($class)
    {
        try {
            $reflectionClass = new \ReflectionClass($class);
            $method = $reflectionClass->getMethod('__construct');
        } catch (\ReflectionException $e) {
            return [];
        }

        $startLine = $method->getStartLine() + 1;
        $endLine = $method->getEndLine() - 1;

        $storage = $this->wStorage('Root');
        $classPath = $this->str($class)->explode('\\')->filter();
        $classFile = $this->wApps($classPath[1])->getPath(false) . '/' . $classPath->slice(2)->implode('\\')->replace('\\', '/');

        $classFile = new File($classFile . '.php', $storage);
        if (!$classFile->exists()) {
            return [];
        }

        $classContents = $classFile->getContents();
        $classLines = $this->str($classContents)->explode("\n");

        $entityApiLines = $classLines->slice($startLine, $endLine - $startLine, false);

        $apiDocs = [];
        $tmpDoc = $this->arr();
        foreach ($entityApiLines as $line => $code) {
            $code = $this->str($code)->trim();
            if ($code->trim()->contains('parent::__construct') && $class !== $this->baseClass) {
                $parentClass = $reflectionClass->getParentClass()->getName();
                $parentApi = $this->parseApi($parentClass);
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
                $match = $code->match('\'(\w+)\',\s?\'([\w+-{}/]+)\'');
                if (!$match) {
                    throw new AppException('Failed to parse API method definition: `' . $code->val() . '`', 'WBY-DISCOVER-FAILED');
                }
                $httpMethod = strtolower($match->keyNested('1.0'));
                $methodName = $match->keyNested('2.0');
                $methodName = $methodName != '/' ? trim($methodName, '/') : '/';
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
                        'name'        => $line->replace(['body.', 'path.'], '')->val(),
                        'description' => $paramLine[1]
                    ];

                    $tmpDoc->keyNested($annotationLine[0], $param);
                    continue;
                }
                $tmpDoc->keyNested($annotationLine[0], $annotationLine[1]);

                // Query params will be appended to URL in the EntityParser/ServiceParser classes
                if ($line->startsWith('query.')) {
                    $paramLine = $this->str($annotationLine[1])->explode(' ', 2);
                    $tmpDoc->keyNested($annotationLine[0], $paramLine[0]);
                }
            }
        }

        return $apiDocs;
    }
}