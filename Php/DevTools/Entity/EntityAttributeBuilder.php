<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\DevTools\Entity;

use Apps\Core\Php\DevTools\Entity\Attributes\PriceAttribute;

/**
 * EntityBuilder
 */

class EntityAttributeBuilder extends \Webiny\Component\Entity\EntityAttributeBuilder
{
    /**
     * @var EntityAbstract
     */

    protected $entity;

    public function price($min, $max) {
        return $this->attributes[$this->attribute] = new PriceAttribute($this->attribute, $this->entity, $min, $max);
    }
}