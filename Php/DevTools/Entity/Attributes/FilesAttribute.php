<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools\Entity\Attributes;

use Webiny\Component\Entity\Attribute\One2ManyAttribute;
use Webiny\Component\Entity\EntityAbstract;

/**
 * File attribute
 * @package Ht\Platform\Entity\Attribute
 */
class FilesAttribute extends One2ManyAttribute
{
    /**
     * @inheritDoc
     */
    public function __construct($attribute, EntityAbstract $entity)
    {
        parent::__construct($attribute, $entity, 'ref');
        $this->setEntity('\Apps\Core\Php\Entities\File');
    }

}