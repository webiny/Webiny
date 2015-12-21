<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Webiny\Core\Entity;

use Webiny\Core\Entity\Attribute\CurrentAdminAttribute;
use Webiny\Core\Entity\Attribute\CurrentUserAttribute;
use Webiny\Core\Entity\Attribute\FileAttribute;
use Webiny\Core\Entity\Attribute\FilesAttribute;
use Webiny\Core\Entity\Attribute\GeoLocationAttribute;
use Webiny\Core\Entity\Attribute\PriceAttribute;


/**
 * EntityBuilder
 */
class EntityAttributeBuilder extends \Webiny\Component\Entity\EntityAttributeBuilder
{
    /**
     * Creates price field with predefined values and validators, override min and max values if needed.
     * @param float|int $min
     * @param int $max
     * @return PriceAttribute
     */
    public function price($min = 0, $max = 1000)
    {
        return $this->attributes[$this->attribute] = new PriceAttribute($this->attribute, $this->entity, $min, $max);
    }

    /**
     * @return PriceAttribute
     */
    public function geoLocation()
    {
        return $this->attributes[$this->attribute] = new GeoLocationAttribute($this->attribute, $this->entity);
    }

    /**
     * @return CurrentAdminAttribute
     */
    public function currentAdmin()
    {
        return $this->attributes[$this->attribute] = new CurrentAdminAttribute($this->attribute, $this->entity);
    }

    /**
     * @return CurrentAdminAttribute
     */
    public function currentUser()
    {
        return $this->attributes[$this->attribute] = new CurrentUserAttribute($this->attribute, $this->entity);
    }

    /**
     * @return FileAttribute
     */
    public function file()
    {
        return $this->attributes[$this->attribute] = new FileAttribute($this->attribute, $this->entity);
    }

    /**
     * @return FilesAttribute
     */
    public function files()
    {
        return $this->attributes[$this->attribute] = new FilesAttribute($this->attribute, $this->entity);
    }
}