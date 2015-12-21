<?php
namespace Webiny\Core\Entity\Validators;

use Webiny\Core\Traits\ValidationTrait;
use Webiny\Component\Entity\Attribute\AttributeAbstract;

use Webiny\Component\Entity\Validation\ValidatorInterface;

class MinLength implements ValidatorInterface
{
    use ValidationTrait;

    /**
     * @inheritDoc
     */
    public function validate($data, AttributeAbstract $attribute, $params = [])
    {
        $this->getValidation()->validate($data, 'minLength:' . $params[0]);
        return true;
    }

}