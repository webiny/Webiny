<?php

namespace Apps\Webiny\Php\Lib\Apps\Parser;

use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use ReflectionFunction;
use Webiny\Component\Entity\Attribute\AbstractAttribute;
use Webiny\Component\Entity\Attribute\Many2OneAttribute;
use Webiny\Component\Entity\Attribute\One2ManyAttribute;

class EntityParser extends AbstractParser
{
    protected $baseClass = AbstractEntity::class;
    private $apiMethods;
    private $defaultValues;
    private $attributeDescription;

    function __construct($class)
    {
        parent::__construct($class);
        $this->slug = $this->str($this->name)->kebabCase()->pluralize()->val();
        $this->url = '/entities/' . $this->getAppSlug() . '/' . $this->slug;
        $this->defaultValues = [
            'object'   => new \stdClass(),
            'array'    => '',
            'date'     => $this->datetime()->format('Y-m-d'),
            'datetime' => $this->datetime()->format('Y-m-d H:i:s'),
            'id'       => (string)$this->mongo()->id(),
            'boolean'  => true,
            'string'   => ''
        ];
    }

    public function getAttributes()
    {
        /* @var $entity AbstractEntity */
        $entity = new $this->class;
        $attributes = [];
        /* @var $attr AbstractAttribute */
        foreach ($entity->getAttributes() as $attrName => $attr) {
            $attrData = [
                'name'         => $attrName,
                'type'         => self::str(get_class($attr))->explode('\\')->last()->replace('Attribute', '')->caseLower()->val(),
                //'validators'         => join(',', $attr->getValidators()), // TODO: need to detect closure validators
                //'validationMessages' => $attr->getValidationMessages(),
                'defaultValue' => $attr->getDefaultValue()
            ];

            foreach ($this->getAttributeDescriptions()[1] as $descIndex => $descAttr) {
                if ($descAttr == $attrName) {
                    $attrData['description'] = trim($this->attributeDescription[2][$descIndex]);
                }
            }

            if ($attr instanceof Many2OneAttribute || $attr instanceof One2ManyAttribute) {
                $attrData['entity'] = $attr->getEntity();
            }

            $attributes[] = $attrData;
        }

        return $attributes;
    }

    public function getRelations()
    {
        $attributeType = function (AbstractAttribute $attr) {
            if ($attr instanceof Many2OneAttribute) {
                return 'many2one';
            }

            if ($attr instanceof One2ManyAttribute) {
                return 'one2many';
            }

            return self::str(get_class($attr))->explode('\\')->last()->replace('Attribute', '')->caseLower()->val();
        };

        /* @var $entity AbstractEntity */
        $entity = new $this->class;
        $relations = [];
        /* @var $attr AbstractAttribute */
        foreach ($entity->getAttributes() as $attrName => $attr) {
            if ($attr instanceof Many2OneAttribute || $attr instanceof One2ManyAttribute) {
                $relations[] = [
                    'attribute' => $attrName,
                    'class'     => trim($attr->getEntity(), '\\'),
                    'type'      => $attributeType($attr)
                ];
            }
        }

        return $relations;
    }

    public function getApiMethods($includeCrudMethods = true)
    {
        if (!$this->apiMethods) {
            $this->apiMethods = $this->getMethods($includeCrudMethods);
        }

        return $this->apiMethods;
    }

    /**
     * Recursively parse entity classes to find all methods exposed to API
     *
     * @param bool $includeCrudMethods
     *
     * @return array
     * @throws AppException
    */
    private function getMethods($includeCrudMethods)
    {
        $crudPatterns = [
            '/.get',
            '{id}.get',
            '/.post',
            '{id}.patch',
            '{id}.delete'
        ];
        $apiDocs = $this->parseApi($this->class);

        // Parse dynamic methods (appended via onExtendApi callback)
        /* @var $instance AbstractEntity */
        $instance = new $this->class;
        $callbacks = $instance->getClassCallbacks();
        foreach ($callbacks as $class => $events) {
            if (isset($events['onExtendApi'])) {
                foreach ($events['onExtendApi'] as $cb) {
                    $apiDocs->mergeSmart($this->readExtendedApi($cb));
                }
            }
        }

        $methods = [];
        /* @var $entityInstance AbstractEntity */
        $entityInstance = new $this->class;
        foreach ($apiDocs as $name => $httpMethods) {
            foreach ($httpMethods as $httpMethod => $config) {
                $config = $this->arr($config);
                $key = $name . '.' . $httpMethod;

                // There may be a case when a developer uses a trait with extra api methods and parser registers those methods
                // but if those methods are not initialized, this following check may fail with an error.
                // To avoid that and similar situations - we check if method is initialized before doing anything else.
                $entityMethod = $entityInstance->getApi()->getMethod($httpMethod, $name);
                if (!$entityMethod) {
                    continue;
                }

                $crudMethod = in_array($key, $crudPatterns);
                if (!$includeCrudMethods && $crudMethod && !$config->key('custom', false, true)) {
                    continue;
                }


                $config = $this->arr($config);
                $definition = [
                    'key'           => $key,
                    'path'          => $this->url . '/' . ltrim($name, '/'),
                    'url'           => $this->wConfig()->get('Application.ApiPath') . $this->url . '/' . ltrim($name, '/'),
                    'name'          => $config->key('name'),
                    'description'   => $config->key('description', '', true),
                    'method'        => strtoupper($httpMethod),
                    'public'        => false,
                    'authorization' => true,
                    'custom'        => !$crudMethod || $config->key('custom', false, true),
                    'headers'       => []
                ];

                $isPublic = $entityMethod->getPublic();
                $definition['public'] = $isPublic;
                $definition['authorization'] = !$isPublic;

                if ($definition['authorization']) {
                    $definition['headers'][] = $this->headerAuthorizationToken;
                }

                // Build query params and add them to URL
                if (count($config['query']) > 0) {
                    $queryParams = http_build_query($config['query']);
                    $definition['path'] .= '?' . $queryParams;
                    $definition['url'] .= '?' . $queryParams;
                }

                // Build path, body and header parameters
                foreach ($config->key('path', [], true) as $pName => $pConfig) {
                    $definition['parameters'][$pName] = [
                        'name'        => $pName,
                        'in'          => 'path',
                        'description' => $pConfig['description'] ?? '',
                        'type'        => $pConfig['type'] ?? ''
                    ];
                }

                foreach ($config->key('body', [], true) as $pName => $pConfig) {
                    $definition['body'][$pName] = [
                        'type'  => $pConfig['type'] ?? '',
                        'value' => $pConfig['value'] ?? null
                    ];
                }
                foreach ($config->key('headers', [], true) as $pName => $pConfig) {
                    $definition['headers'][$pName] = [
                        'name'        => $pName,
                        'description' => $pConfig['description'] ?? '',
                        'type'        => $pConfig['type'] ?? '',
                        'required'    => true
                    ];
                }

                $methods[] = $definition;
            }
        }

        return $methods;
    }

    protected function readExtendedApi($function)
    {
        $func = new ReflectionFunction($function);
        $filename = $func->getFileName();
        $startLine = $func->getStartLine() - 1; // we do -1 to also get the function block
        $endLine = $func->getEndLine();

        $source = file($filename);
        $code = implode('', array_slice($source, $startLine, $endLine - $startLine));

        return $this->parseCode($code);
    }

    private function getAttributeDescriptions()
    {
        if ($this->attributeDescription) {
            return $this->attributeDescription;
        }

        // Extract attribute descriptions from @property annotation
        $reflection = new \ReflectionClass($this->class);
        $comments = $reflection->getDocComment();
        $this->attributeDescription = [];
        preg_match_all('#@property[a-zA-Z\s]+\$([a-zA-Z]+)(.*)?#m', $comments, $this->attributeDescription);

        return $this->attributeDescription;
    }
}