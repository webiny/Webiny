<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools\Entity\Attributes;

use Webiny\Component\Entity\Attribute\Many2OneAttribute;
use Webiny\Component\Entity\EntityAbstract;

/**
 * File attribute
 * @package Ht\Platform\Entity\Attribute
 */
class FileAttribute extends Many2OneAttribute
{
    /**
     * @inheritDoc
     */
    public function __construct($attribute, EntityAbstract $entity)
    {
        parent::__construct($attribute, $entity);
        $this->setEntity('\Apps\Core\Php\Entities\File')->onSetNull('delete')->setUpdateExisting();
    }
}