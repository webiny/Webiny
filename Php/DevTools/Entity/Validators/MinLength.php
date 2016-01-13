<?php
namespace Apps\Core\Php\DevTools\Entity\Validators;

use Apps\Core\Php\DevTools\Validation\ValidationHelper;
use Webiny\Component\Entity\Attribute\AttributeAbstract;
use Webiny\Component\Entity\Validation\ValidatorInterface;

class MinLength implements ValidatorInterface
{
    /**
     * @inheritDoc
     */
    public function validate($data, AttributeAbstract $attribute, $params = [])
    {
        ValidationHelper::getInstance()->validate($data, 'minLength:' . $params[0]);
        return true;
    }
}