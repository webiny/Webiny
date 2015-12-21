<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Webiny\Core\Entity\Attribute;

use Webiny\Core\Traits\PlatformTrait;
use Webiny\Component\Entity\Attribute\Many2OneAttribute;
use Webiny\Component\Entity\EntityAbstract;

/**
 * File attribute
 * @package Webiny\Core\Entity\Attribute
 */
class FileAttribute extends Many2OneAttribute
{
    use PlatformTrait;

    /**
     * @inheritDoc
     */
    public function __construct($attribute, EntityAbstract $entity)
    {
        parent::__construct($attribute, $entity);
        $this->setEntity('\Ht\Entities\File')->onSetNull('delete')->setUpdateExisting();
    }

}