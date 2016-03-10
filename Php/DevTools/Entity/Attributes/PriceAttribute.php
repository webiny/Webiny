<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools\Entity\Attributes;

use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Webiny\Component\Entity\Attribute\FloatAttribute;

/**
 * Price attribute
 * @package Apps\Core\Php\DevTools\Entity\Attributes
 */
class PriceAttribute extends FloatAttribute
{
    /**
     * @inheritDoc
     */
    public function __construct($attribute, EntityAbstract $entity, $min, $max)
    {
        parent::__construct($attribute, $entity);
        $this->setValidators('required,number,gt:' . $min . ',lte:' . $max);
        $this->setDefaultValue(0);
    }
}