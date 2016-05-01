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
 * @package Apps\Core\Php\DevTools\Entity\Attributes
 */
class FilesAttribute extends One2ManyAttribute
{
    /**
     * @inheritDoc
     */
    public function __construct()
    {
        parent::__construct(null, null, 'ref');
        $this->setEntity('\Apps\Core\Php\Entities\File')->setSorter('order');
    }

}