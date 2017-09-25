<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\Entity\Validators;

use Webiny\Component\Entity\Attribute\AbstractAttribute;
use Webiny\Component\Entity\Attribute\Validation\ValidationException;
use Webiny\Component\Entity\Attribute\Validation\ValidatorInterface;

class Unique implements ValidatorInterface
{
    /**
     * @inheritDoc
     */
    public function getName()
    {
        return 'unique';
    }

    /**
     * @inheritDoc
     */
    public function validate(AbstractAttribute $attribute, $data, $params = [])
    {
        if (empty($data)) {
            return;
        }

        // If record is deleted, it will have `deletedOn` !== null
        $query = [
            $attribute->attr() => $data,
            'deletedOn'        => null
        ];

        $id = $attribute->getParent()->id;
        if ($id) {
            $query['id'] = [
                '$ne' => $id
            ];
        }

        $exists = call_user_func_array([$attribute->getParent(), 'findOne'], [$query]);
        if ($exists) {
            throw new ValidationException('A record with this attribute value already exists.');
        }
    }
}