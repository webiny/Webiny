<?php
namespace Webiny\Core\Entity\Validators;

use Webiny\Core\Traits\ValidationTrait;
use Webiny\Component\Entity\Attribute\AttributeAbstract;

use Webiny\Component\Entity\Validation\ValidatorInterface;
use Webiny\Component\StdLib\StdLibTrait;

class In implements ValidatorInterface
{
    use StdLibTrait, ValidationTrait;

    /**
     * @inheritDoc
     */
    public function validate($data, AttributeAbstract $attribute, $params = [])
    {
        $params = is_string($params) ? $params : implode(':', $params);
        $this->getValidation()->validate($data, 'in:' . $params);
        return true;
    }

}