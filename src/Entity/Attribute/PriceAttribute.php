<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Webiny\Core\Entity\Attribute;

use Webiny\Component\Entity\Attribute\FloatAttribute;
use Webiny\Component\Entity\EntityAbstract;

/**
 * Price attribute
 * @package Webiny\Core\Entity\Attribute
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