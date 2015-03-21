<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Webiny\Platform\Entity;

use Webiny\Platform\Entity\Attribute\Many2OneAttribute;


/**
 * EntityBuilder
 */

class EntityAttributeBuilder extends \Webiny\Component\Entity\EntityAttributeBuilder
{
    public function file() {
        return;
    }

    /**
     * @return Many2OneAttribute
     */
    public function many2one()
    {
        return $this->attributes[$this->attribute] = new Many2OneAttribute($this->attribute, $this->entity);
    }
}