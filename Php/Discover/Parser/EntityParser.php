<?php
namespace Apps\Core\Php\Discover\Parser;

use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Apps\Core\Php\DevTools\Exceptions\AppException;
use Webiny\Component\Entity\Attribute\AbstractAttribute;
use Webiny\Component\Entity\Attribute\AttributeType;
use Webiny\Component\StdLib\StdObject\StdObjectException;

class EntityParser extends AbstractParser
{
    protected $baseClass = 'Apps\Core\Php\DevTools\Entity\AbstractEntity';
    private $apiMethods;
    private $defaultValues;
    private $headerAuthorizationToken;

    function __construct(AppParser $app, $endpoint)
    {
        parent::__construct($app, $endpoint);
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

        $this->headerAuthorizationToken = [
            'name'        => 'X-Webiny-Authorization',
            'description' => 'Authorization token',
            'type'        => 'string',
            'required'    => true
        ];

        $this->headerApiToken = [
            'name'        => 'X-Webiny-Api-Token',
            'description' => 'API token',
            'type'        => 'string',
            'required'    => true
        ];
    }

    public function getApiMethods()
    {
        if (!$this->apiMethods) {
            $this->apiMethods = $this->getCustomMethods();
        }

        return $this->apiMethods;
    }

    public function getRequiredAttributes()
    {
        $required = [];

        /* @var $entity AbstractEntity */
        $entity = new $this->class;

        /* @var $attr AbstractAttribute */

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
                    'headers'     => [
                        'X-Webiny-Authorization' => $this->headerAuthorizationToken,
                        'X-Webiny-Api-Token'     => $this->headerApiToken
                    ]
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