<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools\Entity\Attribute;

use Webiny\Component\StdLib\StdObject\StdObjectWrapper;

/**
 * Many2One attribute
 * @package Apps\Core\Php\DevTools\Entity\Attribute
 */
class Many2OneAttribute extends \Webiny\Component\Entity\Attribute\Many2OneAttribute
{

    /**
     * Set entity class for this attribute
     *
     * @param string $entityClass
     *
     * @return $this
     */
    public function setEntity($entityClass)
    {
        $entityClass = $this->str($entityClass);
        if ($entityClass->contains('.')) {
            $parts = $entityClass->explode('.');
            $entityClass = '\\WebinyPlatform\\Apps\\' . $parts[0] . '\\Php\\' . $parts[1] . '\\Entities\\' . $parts[2];
        }
        $this->entityClass = StdObjectWrapper::toString($entityClass);

        return $this;
    }
}