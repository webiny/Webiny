<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\Entity;

use Apps\Webiny\Php\Lib\Entity\Attributes\FileAttribute;
use Apps\Webiny\Php\Lib\Entity\Attributes\FilesAttribute;
use Apps\Webiny\Php\Lib\Entity\Attributes\ImageAttribute;
use Apps\Webiny\Php\Lib\Entity\Attributes\ImagesAttribute;
use Apps\Webiny\Php\Lib\Entity\Attributes\Many2ManyAttribute;
use Apps\Webiny\Php\Lib\Entity\Attributes\UserAttribute;
use Apps\Webiny\Php\Lib\WebinyTrait;

/**
 * Class EntityAttributeContainer
 *
 * This class adds custom Webiny Platform attributes on top of those provided by the Framework.
 */
class EntityAttributeContainer extends \Webiny\Component\Entity\EntityAttributeContainer
{
    use WebinyTrait;

    /**
     * Create a many2many attribute.
     *
     * This attribute overrides the one from the Framework to add handling of system attributes (createdOn, createdBy, etc.).
     * Most importantly, it handles the `deletedOn` field to only load records which are not deleted.
     *
     * @return Many2ManyAttribute
     */
    public function many2many($collectionName, $thisField, $refField)
    {
        $params = [$this->attribute, $thisField, $refField, $this->entity, $collectionName];

        return $this->attributes[$this->attribute] = new Many2ManyAttribute(...$params);
    }

    /**
     * Create a User attribute.
     * This attribute takes care of loading the correct user entity since the platform supports different user entity classes.
     *
     * @return UserAttribute
     */
    public function user()
    {
        $attribute = new UserAttribute();
        $attribute->setName($this->attribute)->setParent($this->entity);

        return $this->attributes[$this->attribute] = $attribute;
    }

    /**
     * Create a file attribute
     * This attribute handles storage of files to the defined storage and local database.
     *
     * @return FileAttribute
     */
    public function file()
    {
        $attribute = new FileAttribute();
        $attribute->setName($this->attribute)->setParent($this->entity);

        return $this->attributes[$this->attribute] = $attribute;
    }

    /**
     * Create a files attribute
     * Similar to file attribute, but handles multiple files at once.
     *
     * @return FilesAttribute
     */
    public function files()
    {
        $attribute = new FilesAttribute();
        $attribute->setName($this->attribute)->setParent($this->entity);

        return $this->attributes[$this->attribute] = $attribute;
    }

    /**
     * Create an image attribute
     * This attribute handles storage of an image to the defined storage and local database.
     * It also takes care of image dimensions (sizes).
     *
     * @return ImageAttribute
     */
    public function image()
    {
        $attribute = new ImageAttribute();
        $attribute->setName($this->attribute)->setParent($this->entity);

        return $this->attributes[$this->attribute] = $attribute;
    }

    /**
     * Create an images attribute
     * Similar to image attribute, but handles multiple images at once.
     * Best to use for galleries.
     *
     * @return ImagesAttribute
     */
    public function images()
    {
        $attribute = new ImagesAttribute();
        $attribute->setName($this->attribute)->setParent($this->entity);

        return $this->attributes[$this->attribute] = $attribute;
    }
}