<?php
namespace Webiny\Core\Traits;


use Webiny\Core\Traits\Helpers\ValidationHelper;

trait ValidationTrait
{
    /**
     * @return ValidationHelper
     */
    public function getValidation() {
        return ValidationHelper::getInstance();
    }
}