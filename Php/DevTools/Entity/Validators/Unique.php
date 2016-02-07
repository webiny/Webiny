<?php
namespace Apps\Core\Php\DevTools\Entity\Validators;

use Apps\Core\Php\DevTools\Validation\ValidationException;
use Webiny\Component\Entity\Attribute\AttributeAbstract;
use Webiny\Component\Entity\Validation\ValidatorInterface;

class Unique implements ValidatorInterface
{
    /**
     * @inheritDoc
     */
    public function validate($data, AttributeAbstract $attribute, $params = [])
    {
        if (empty($data)) {
            return;
        }

        $query = [
            $attribute->attr() => $data
        ];

        $id = $attribute->getEntity()->id;
        if ($id) {
            $query['id'] = [
                '$ne' => $id
            ];
        }

        $exists = call_user_func_array([$attribute->getEntity(), 'findOne'], [$query]);
        if ($exists) {
            throw new ValidationException('A record with this attribute value already exists.');
        }
    }
}