<?php
namespace Apps\Webiny\Php\DevTools\Validators;

use Apps\Webiny\Php\DevTools\WebinyTrait;
use Webiny\Component\Validation\ValidationException;
use Webiny\Component\Validation\ValidatorInterface;

class Password implements ValidatorInterface
{
    use WebinyTrait;

    private $regex;
    private $message;

    public function __construct($regex, $message)
    {
        $this->regex = $regex;
        $this->message = $message;
    }

    public function getName()
    {
        return 'password';
    }

    public function validate($value, $params = [], $throw = false)
    {
        $isDevPassword = $this->wIsProduction() ? false : in_array($value, ['dev', 'admin']);
        $isFullyValid = preg_match_all($this->regex, $value);

        if ($isDevPassword || $isFullyValid) {
            return true;
        }

        if ($throw) {
            throw new ValidationException($this->message);
        }

        return $this->message;
    }
}