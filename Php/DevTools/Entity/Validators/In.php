<?php
namespace Apps\Core\Php\DevTools\Entity\Validators;

use Apps\Core\Php\DevTools\Validation\ValidationHelper;
use Webiny\Component\Entity\Attribute\AttributeAbstract;
use Webiny\Component\Entity\Validation\ValidatorInterface;

class In implements ValidatorInterface
{
    /**
     * @inheritDoc
     */
    public function validate($data, AttributeAbstract $attribute, $params = [])
    {
        $params = is_string($params) ? $params : implode(':', $params);
        ValidationHelper::getInstance()->validate($data, 'in:' . $params);
        return true;
    }
}