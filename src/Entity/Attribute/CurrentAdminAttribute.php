<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Webiny\Core\Entity\Attribute;

use Ht\Entities\Admin;
use Webiny\Core\Traits\PlatformTrait;
use Webiny\Component\Entity\Attribute\Many2OneAttribute;
use Webiny\Component\Entity\EntityAbstract;

/**
 * CurrentAdmin attribute
 * @package Webiny\Core\Entity\Attribute
 */
class CurrentAdminAttribute extends Many2OneAttribute
{
    use PlatformTrait;

    /**
     * @inheritDoc
     */
    public function __construct($attribute, EntityAbstract $entity)
    {
        parent::__construct($attribute, $entity);
        $admin = $this->getUser() instanceof Admin ? $this->getUser() : null;
        $this->setEntity('\Ht\Entities\Admin')->setDefaultValue($admin);
    }
}