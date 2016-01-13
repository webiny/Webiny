<?php

namespace Apps\Core\Php\DevTools\Validation;

use Webiny\Component\Entity\Validation\ValidationException as WebinyValidationException;

class ValidationException extends WebinyValidationException
{
    const INVALID_EMAIL = 201;
    const INVALID_COUNTRY_CODE = 202;
    const INVALID_CREDIT_CARD = 203;
    const INVALID_GEO_LOCATION = 204;
    const INVALID_NUMBER = 205;
    const INVALID_PASSWORD = 206;
    const INVALID_PHONE = 207;
    const INVALID_URL = 208;
    const GREATER_THAN = 209;
    const LESS_THAN = 210;
    const MAX_LENGTH = 211;
    const MIN_LENGTH = 212;
    const REQUIRED = 213;
    const IN = 214;
    const EU_COUNTRY = 215;
    const EU_VAT_NUMBER = 216;
    const INVALID_INTEGER = 217;

    protected static $messages = [
        201 => 'You have provided an invalid email address.',
        202 => 'You have provided an invalid two-letter (ISO 3166-1 alpha-2) country code.',
        203 => 'You have provided an invalid credit card number.',
        204 => 'You have provided invalid geo location data.',
        205 => 'You have not provided a number.',
        206 => 'Password must contain at least 8 characters, minimum one letter and one number.',
        207 => 'Provided phone number is invalid.',
        208 => 'You have provided an invalid URL.',
        209 => 'Value must be greater than %s',
        210 => 'Value must be less than %s',
        211 => 'Value must contain %s characters at most.',
        212 => 'Value must contain %s characters at least.',
        213 => 'Value is required.',
        214 => 'Value must be one of the following: %s',
        215 => 'Please select a EU country.',
        216 => 'Please enter a valid EU VAT number.',
        217 => 'You have not provided an integer.',
    ];
}