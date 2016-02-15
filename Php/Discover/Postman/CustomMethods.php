<?php
namespace Apps\Core\Php\Discover\Postman;

use ReflectionClass;
use Webiny\Component\Annotations\AnnotationsTrait;
use Webiny\Component\Storage\File\File;

class CustomMethods extends AbstractEndPoint
{
    use AnnotationsTrait;

    public function getRequests()
    {
        $class = new ReflectionClass($this->ep->getEntityClass());
        $method = $class->getMethod('entityApi');
        $startLine = $method->getStartLine() + 1;
        $endLine = $method->getEndLine() - 1;

        $storage = $this->wStorage('Root');

        $classFile = new File($this->str($this->ep->getEntityClass())->replace('\\', '/')->append('.php'), $storage);
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
