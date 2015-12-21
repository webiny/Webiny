<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Webiny\Core\Entity\Attribute;

use Webiny\Component\Entity\Attribute\ArrayAttribute;
use Webiny\Component\Entity\EntityAbstract;

/**
 * GeoLocationAttribute attribute
 * @package Webiny\Core\Entity\Attribute
 */
class GeoLocationAttribute extends ArrayAttribute
{
    /**
     * @inheritDoc
     */
    public function __construct($attribute, EntityAbstract $entity)
    {
        parent::__construct($attribute, $entity);
        $this->setDefaultValue(['lat' => 0, 'lng' => 0]);
    }


}