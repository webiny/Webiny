<?php
namespace Apps\Core\Php\Discover\Postman;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Webiny\Component\Entity\Attribute\AttributeAbstract;
use Webiny\Component\Entity\Attribute\AttributeType;
use Webiny\Component\StdLib\StdLibTrait;

abstract class AbstractEndPoint
{
    use DevToolsTrait, StdLibTrait;

    /**
     * @var EntityEndPoint
     */
    protected $ep;
    protected $requests;

    function __construct(EntityEndPoint $entityEndpoint)
    {
        $this->ep = $entityEndpoint;
        $this->requests = [];
    }

    abstract public function getRequests();

    protected function getRequestAttributes()
    {
        $required = [];
        $entityClass = $this->ep->getEntityClass();

        /* @var $entity EntityAbstract */
        $entity = new $entityClass;

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

    protected function getRequestData()
    {
        return json_encode($this->getRequestAttributes(), JSON_PRETTY_PRINT);
    }
}
