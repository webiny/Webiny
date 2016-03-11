<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools\Entity\Attributes;

use Webiny\Component\Entity\Attribute\AttributeAbstract;

/**
 * Email attribute
 * @package Apps\Core\Php\Entities\Attributes
 */
class EmailAttribute extends AttributeAbstract
{
    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setValidators('required,email,unique');
        $this->onSet(function ($email) {
            return trim(strtolower($email));
        });
    }
}