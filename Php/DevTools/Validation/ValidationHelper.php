<?php

namespace Webiny\Core\Traits\Helpers;

use Webiny\Core\Platform;
use Webiny\Component\StdLib\SingletonTrait;

class ValidationHelper
{
    use SingletonTrait;

    public function validate($data, $validators = [])
    {
        $validators = $this->getValidators($validators);
        $messages = [];
        foreach ($validators as $validator) {
            try {
                $validator = explode(':', $validator);

                $functionParams = [$data];

                // Check number of params, if more than one, than put all those into an array
                $validatorParams = array_splice($validator, 1);
                switch (count($validatorParams)) {
                    case 0:
                        break;
                    case 1:
                        $functionParams[] = $validatorParams[0];
                        break;
                    default:
                        $functionParams[] = $validatorParams;
                }

                $functionParams[] = true;
                call_user_func_array([$this, $validator[0]], $functionParams);
            } catch (ValidationException $e) {
                $messages[] = $e->getMessage();
            }
        }
        if (count($messages)) {
            throw new ValidationException(count($messages) == 1 ? $messages[0] : $messages);
        }

        return true;
    }

    /**
     * @param      $email
     * @param bool $exception
     *
     * @return mixed
     * @throws ValidationException
     */
    public function email($email, $exception = false)
    {
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return true;
        }
        if ($exception) {
            throw new ValidationException(ValidationException::INVALID_EMAIL);
        }
    }

    /**
     * @param      $data
     * @param bool $exception
     *
     * @return bool
     * @throws ValidationException
     */
    public function geoLocation($data, $exception = false)
    {
        if (is_array($data) && isset($data['lat']) && isset($data['lat'])) {
            return true;
        }
        if ($exception) {
            throw new ValidationException(ValidationException::INVALID_GEO_LOCATION);
        }
    }

    /**
     * @param      $value
     * @param      $limit
     * @param bool $exception
     *
     * @return bool
     * @throws ValidationException
     */
    public function gt($value, $limit, $exception = false)
    {
        if ($value > $limit) {
            return true;
        }
        if ($exception) {
            throw new ValidationException(ValidationException::GREATER_THAN, $limit);
        }
    }

    /**
     * @param      $value
     * @param      $limit
     * @param bool $exception
     *
     * @return bool
     * @throws ValidationException
     */
    public function gte($value, $limit, $exception = false)
    {
        if ($value >= $limit) {
            return true;
        }
        if ($exception) {
            throw new ValidationException(ValidationException::GREATER_THAN, $limit);
        }
    }

    /**
     * @param      $value
     * @param      $limit
     * @param bool $exception
     *
     * @return bool
     * @throws ValidationException
     */
    public function lt($value, $limit, $exception = false)
    {
        if ($value < $limit) {
            return true;
        }
        if ($exception) {
            throw new ValidationException(ValidationException::LESS_THAN, $limit);
        }
    }

    /**
     * @param      $value
     * @param      $limit
     * @param bool $exception
     *
     * @return bool
     * @throws ValidationException
     */
    public function lte($value, $limit, $exception = false)
    {
        if ($value <= $limit) {
            return true;
        }
        if ($exception) {
            throw new ValidationException(ValidationException::LESS_THAN, $limit);
        }
    }

    /**
     * @param      $data
     * @param      $limit
     * @param bool $exception
     *
     * @return bool
     * @throws ValidationException
     */
    public function maxLength($data, $limit, $exception = false)
    {
        $length = is_string($data) ? strlen($data) : count($data);
        if ($length <= $limit) {
            return true;
        }
        if ($exception) {
            throw new ValidationException(ValidationException::MAX_LENGTH, $length);
        }
    }

    /**
     * @param      $data
     * @param      $limit
     * @param bool $exception
     *
     * @return bool
     * @throws ValidationException
     */
    public function minLength($data, $limit, $exception = false)
    {
        $length = is_string($data) ? strlen($data) : count($data);
        if ($length >= $limit) {
            return true;
        }
        if ($exception) {
            throw new ValidationException(ValidationException::MIN_LENGTH, $length);
        }
    }

    /**
     * @param      $data
     * @param      $values Array|string Can be comma separated values or an array
     * @param bool $exception
     *
     * @return bool
     * @throws ValidationException
     */
    public function in($data, $values, $exception = false)
    {
        $values = is_string($values) ? explode(',', $values) : $values;
        if (in_array($data, $values)) {
            return true;
        }
        if ($exception) {
            throw new ValidationException(ValidationException::IN, implode(', ', $values) . '.');
        }
    }

    /**
     * @param      $number
     * @param bool $exception
     *
     * @return bool
     * @throws ValidationException
     */
    public function number($number, $exception = false)
    {
        if (is_numeric($number)) {
            return true;
        }
        if ($exception) {
            throw new ValidationException(ValidationException::INVALID_NUMBER);
        }
    }

    /**
     * Does not check the actual type of validator, only if the number itself is integer format
     * (negative, zero or positive whole number)
     * @param      $number
     * @param bool $exception
     *
     * @return bool
     * @throws ValidationException
     */
    public function integer($number, $exception = false)
    {
        if (is_numeric($number) && $number == intval($number)) {
            return true;
        }
        if ($exception) {
            throw new ValidationException(ValidationException::INVALID_INTEGER);
        }
    }


    public function required($data, $exception = false)
    {
        if (!(is_null($data) || $data === '')) {
            return true;
        }
        if ($exception) {
            throw new ValidationException(ValidationException::REQUIRED);
        }
    }

    /**
     * @param      $password
     * @param bool $exception
     *
     * @return bool
     * @throws ValidationException
     */
    public function password($password, $exception = false)
    {
        $isDevPassword = in_array($password, ['dev', 'admin']);
        $isFullyValid = preg_match_all("/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\\d).*$/", $password);

        if ($isDevPassword || $isFullyValid) {
            return true;
        }

        if ($exception) {
            throw new ValidationException(ValidationException::INVALID_PASSWORD);
        }
    }

    /**
     * @param      $phone
     * @param bool $exception
     *
     * @return int
     * @throws ValidationException
     */
    public function phone($phone, $exception = false)
    {
        if (preg_match_all("/^[-+0-9()]+$/", $phone)) {
            return true;
        }

        if ($exception) {
            throw new ValidationException(ValidationException::INVALID_PHONE);
        }
    }

    /**
     * @param      $url
     * @param bool $exception
     *
     * @return mixed
     * @throws ValidationException
     */
    public function url($url, $exception = false)
    {
        if (filter_var($url, FILTER_VALIDATE_URL)) {
            return true;
        }

        if ($exception) {
            throw new ValidationException(ValidationException::INVALID_URL);
        }
    }

    /**
     * @param      $code
     * @param bool $exception
     *
     * @return bool
     * @throws ValidationException
     */
    public function countryCode($code, $exception = false)
    {
        $twoLetterCodes = [
            'AF',
            'AX',
            'AL',
            'DZ',
            'AS',
            'AD',
            'AO',
            'AI',
            'AQ',
            'AG',
            'AR',
            'AM',
            'AW',
            'AU',
            'AT',
            'AZ',
            'BS',
            'BH',
            'BD',
            'BB',
            'BY',
            'BE',
            'BZ',
            'BJ',
            'BM',
            'BT',
            'BO',
            'BQ',
            'BA',
            'BW',
            'BV',
            'BR',
            'IO',
            'BN',
            'BG',
            'BF',
            'BI',
            'KH',
            'CM',
            'CA',
            'CV',
            'KY',
            'CF',
            'TD',
            'CL',
            'CN',
            'CX',
            'CC',
            'CO',
            'KM',
            'CG',
            'CD',
            'CK',
            'CR',
            'CI',
            'HR',
            'CU',
            'CW',
            'CY',
            'CZ',
            'DK',
            'DJ',
            'DM',
            'DO',
            'EC',
            'EG',
            'SV',
            'GQ',
            'ER',
            'EE',
            'ET',
            'FK',
            'FO',
            'FJ',
            'FI',
            'FR',
            'GF',
            'PF',
            'TF',
            'GA',
            'GM',
            'GE',
            'DE',
            'GH',
            'GI',
            'GR',
            'GL',
            'GD',
            'GP',
            'GU',
            'GT',
            'GG',
            'GN',
            'GW',
            'GY',
            'HT',
            'HM',
            'VA',
            'HN',
            'HK',
            'HU',
            'IS',
            'IN',
            'ID',
            'IR',
            'IQ',
            'IE',
            'IM',
            'IL',
            'IT',
            'JM',
            'JP',
            'JE',
            'JO',
            'KZ',
            'KE',
            'KI',
            'KP',
            'KR',
            'KW',
            'KG',
            'LA',
            'LV',
            'LB',
            'LS',
            'LR',
            'LY',
            'LI',
            'LT',
            'LU',
            'MO',
            'MK',
            'MG',
            'MW',
            'MY',
            'MV',
            'ML',
            'MT',
            'MH',
            'MQ',
            'MR',
            'MU',
            'YT',
            'MX',
            'FM',
            'MD',
            'MC',
            'MN',
            'ME',
            'MS',
            'MA',
            'MZ',
            'MM',
            'NA',
            'NR',
            'NP',
            'NL',
            'NC',
            'NZ',
            'NI',
            'NE',
            'NG',
            'NU',
            'NF',
            'MP',
            'NO',
            'OM',
            'PK',
            'PW',
            'PS',
            'PA',
            'PG',
            'PY',
            'PE',
            'PH',
            'PN',
            'PL',
            'PT',
            'PR',
            'QA',
            'RE',
            'RO',
            'RU',
            'RW',
            'BL',
            'SH',
            'KN',
            'LC',
            'MF',
            'PM',
            'VC',
            'WS',
            'SM',
            'ST',
            'SA',
            'SN',
            'RS',
            'SC',
            'SL',
            'SG',
            'SX',
            'SK',
            'SI',
            'SB',
            'SO',
            'ZA',
            'GS',
            'SS',
            'ES',
            'LK',
            'SD',
            'SR',
            'SJ',
            'SZ',
            'SE',
            'CH',
            'SY',
            'TW',
            'TJ',
            'TZ',
            'TH',
            'TL',
            'TG',
            'TK',
            'TO',
            'TT',
            'TN',
            'TR',
            'TM',
            'TC',
            'TV',
            'UG',
            'UA',
            'AE',
            'GB',
            'US',
            'UM',
            'UY',
            'UZ',
            'VU',
            'VE',
            'VN',
            'VG',
            'VI',
            'WF',
            'EH',
            'YE',
            'ZM',
            'ZW',
        ];

        if (in_array($code, $twoLetterCodes)) {
            return true;
        }

        if ($exception) {
            throw new ValidationException(ValidationException::INVALID_COUNTRY_CODE);
        }
    }

    /**
     * @param      $number
     * @param bool $exception
     *
     * @return bool
     * @throws ValidationException
     */
    public function creditCardNumber($number, $exception = false)
    {
        $card_array = array(
            'default'          => array(
                'length' => '13,14,15,16,17,18,19',
                'prefix' => '',
                'luhn'   => true,
            ),
            'american express' => array(
                'length' => '15',
                'prefix' => '3[47]',
                'luhn'   => true,
            ),
            'diners club'      => array(
                'length' => '14,16',
                'prefix' => '36|55|30[0-5]',
                'luhn'   => true,
            ),
            'discover'         => array(
                'length' => '16',
                'prefix' => '6(?:5|011)',
                'luhn'   => true,
            ),
            'jcb'              => array(
                'length' => '15,16',
                'prefix' => '3|1800|2131',
                'luhn'   => true,
            ),
            'maestro'          => array(
                'length' => '16,18',
                'prefix' => '50(?:20|38)|6(?:304|759)',
                'luhn'   => true,
            ),
            'mastercard'       => array(
                'length' => '16',
                'prefix' => '5[1-5]',
                'luhn'   => true,
            ),
            'visa'             => array(
                'length' => '13,16',
                'prefix' => '4',
                'luhn'   => true,
            ),
        );

        // Remove all non-digit characters from the number
        if (($number = preg_replace('/\D+/', '', $number)) === '') {
            if ($exception) {
                throw new ValidationException(ValidationException::INVALID_CREDIT_CARD);
            }

            return false;
        }

        // Use the default type
        $type = 'default';

        $cards = $card_array;

        // Check card type
        $type = strtolower($type);

        if (!isset($cards[$type])) {
            if ($exception) {
                throw new ValidationException(ValidationException::INVALID_CREDIT_CARD);
            }

            return false;
        }

        // Check card number length
        $length = strlen($number);

        // Validate the card length by the card type
        if (!in_array($length, preg_split('/\D+/', $cards[$type]['length']))) {
            if ($exception) {
                throw new ValidationException(ValidationException::INVALID_CREDIT_CARD);
            }

            return false;
        }

        // Check card number prefix
        if (!preg_match('/^' . $cards[$type]['prefix'] . '/', $number)) {
            if ($exception) {
                throw new ValidationException(ValidationException::INVALID_CREDIT_CARD);
            }

            return false;
        }

        // No Luhn check required
        if ($cards[$type]['luhn'] == false) {
            return true;
        }

        if ($this->luhn($number)) {
            return true;
        }
        if ($exception) {
            throw new ValidationException(ValidationException::INVALID_CREDIT_CARD);
        }

        return false;
    }

    /**
     * Return credit card type if number is valid
     * @return string
     * @param $number string
     **/
    public function creditCardType($number)
    {
        $number=preg_replace('/[^\d]/','',$number);
        if (preg_match('/^3[47][0-9]{13}$/',$number))
        {
            return 'american';
        }
        elseif (preg_match('/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/',$number))
        {
            return 'diners';
        }
        elseif (preg_match('/^6(?:011|5[0-9][0-9])[0-9]{12}$/',$number))
        {
            return 'discover';
        }
        elseif (preg_match('/^(?:2131|1800|35\d{3})\d{11}$/',$number))
        {
            return 'jcb';
        }
        elseif (preg_match('/^5[1-5][0-9]{14}$/',$number))
        {
            return 'master';
        }
        elseif (preg_match('/^4[0-9]{12}(?:[0-9]{3})?$/',$number))
        {
            return 'visa';
        }
        else
        {
            return false;
        }
    }

    public function euVatNumber($number, $exception = false)
    {
        $number = strtoupper($number);
        $number = preg_replace('/[ -,.]/', '', $number);
        if (strlen($number) < 8) {
            if ($exception) {
                throw new ValidationException(ValidationException::EU_VAT_NUMBER);
            }

            return false;
        }

        $country = substr($number, 0, 2);
        switch ($country) {
            case 'AT': // AUSTRIA
                $isValid = (bool)preg_match('/^(AT)U(\d{8})$/', $number);
                break;
            case 'BE': // BELGIUM
                $isValid = (bool)preg_match('/(BE)(0?\d{9})$/', $number);
                break;
            case 'BG': // BULGARIA
                $isValid = (bool)preg_match('/(BG)(\d{9,10})$/', $number);
                break;
            case 'CHE': // Switzerland
                $isValid = (bool)preg_match('/(CHE)(\d{9})(MWST)?$/', $number);
                break;
            case 'CY': // CYPRUS
                $isValid = (bool)preg_match('/^(CY)([0-5|9]\d{7}[A-Z])$/', $number);
                break;
            case 'CZ': // CZECH REPUBLIC
                $isValid = (bool)preg_match('/^(CZ)(\d{8,10})(\d{3})?$/', $number);
                break;
            case 'DE': // GERMANY
                $isValid = (bool)preg_match('/^(DE)([1-9]\d{8})/', $number);
                break;
            case 'DK': // DENMARK
                $isValid = (bool)preg_match('/^(DK)(\d{8})$/', $number);
                break;
            case 'EE': // ESTONIA
                $isValid = (bool)preg_match('/^(EE)(10\d{7})$/', $number);
                break;
            case 'EL': // GREECE
                $isValid = (bool)preg_match('/^(EL)(\d{9})$/', $number);
                break;
            case 'ES': // SPAIN
                $isValid = (bool)preg_match('/^(ES)([A-Z]\d{8})$/', $number) || preg_match('/^(ES)([A-H|N-S|W]\d{7}[A-J])$/',
                        $number) || preg_match('/^(ES)([0-9|Y|Z]\d{7}[A-Z])$/', $number) || preg_match('/^(ES)([K|L|M|X]\d{7}[A-Z])$/',
                        $number);
                break;
            case 'EU': // EU type
                $isValid = (bool)preg_match('/^(EU)(\d{9})$/', $number);
                break;
            case 'FI': // FINLAND
                $isValid = (bool)preg_match('/^(FI)(\d{8})$/', $number);
                break;
            case 'FR': // FRANCE
                $isValid = (bool)preg_match('/^(FR)(\d{11})$/', $number) || preg_match('/^(FR)([(A-H)|(J-N)|(P-Z)]\d{10})$/',
                        $number) || preg_match('/^(FR)(\d[(A-H)|(J-N)|(P-Z)]\d{9})$/',
                        $number) || preg_match('/^(FR)([(A-H)|(J-N)|(P-Z)]{2}\d{9})$/', $number);
                break;
            case 'GB': // GREAT BRITAIN
                $isValid = (bool)preg_match('/^(GB)?(\d{9})$/', $number) || preg_match('/^(GB)?(\d{12})$/',
                        $number) || preg_match('/^(GB)?(GD\d{3})$/', $number) || preg_match('/^(GB)?(HA\d{3})$/', $number);
                break;
            case 'GR': // GREECE
                $isValid = (bool)preg_match('/^(GR)(\d{8,9})$/', $number);
                break;
            case 'HR': // CROATIA
                $isValid = (bool)preg_match('/^(HR)(\d{11})$/', $number);
                break;
            case 'HU': // HUNGARY
                $isValid = (bool)preg_match('/^(HU)(\d{8})$/', $number);
                break;
            case 'IE': // IRELAND
                $isValid = (bool)preg_match('/^(IE)(\d{7}[A-W])$/', $number) || preg_match('/^(IE)([7-9][A-Z\*\+)]\d{5}[A-W])$/',
                        $number) || preg_match('/^(IE)(\d{7}[A-W][AH])$/', $number);
                break;
            case 'IT': // ITALY
                $isValid = (bool)preg_match('/^(IT)(\d{11})$/', $number);
                break;
            case 'LV': // LATVIA
                $isValid = (bool)preg_match('/^(LV)(\d{11})$/', $number);
                break;
            case 'LT': // LITHUNIA
                $isValid = (bool)preg_match('/^(LT)(\d{9}|\d{12})$/', $number);
                break;
            case 'LU': // LUXEMBOURG
                $isValid = (bool)preg_match('/^(LU)(\d{8})$/', $number);
                break;
            case 'MT': // MALTA
                $isValid = (bool)preg_match('/^(MT)([1-9]\d{7})$/', $number);
                break;
            case 'NL': // NETHERLAND
                $isValid = (bool)preg_match('/^(NL)(\d{9})B\d{2}$/', $number);
                break;
            case 'NO': // NORWAY
                $isValid = (bool)preg_match('/^(NO)(\d{9})$/', $number);
                break;
            case 'PL': // POLAND
                $isValid = (bool)preg_match('/^(PL)(\d{10})$/', $number);
                break;
            case 'PT': // PORTUGAL
                $isValid = (bool)preg_match('/^(PT)(\d{9})$/', $number);
                break;
            case 'RO': // ROMANIA
                $isValid = (bool)preg_match('/^(RO)([1-9]\d{1,9})$/', $number);
                break;
            case 'RS': // SERBIA
                $isValid = (bool)preg_match('/^(RS)(\d{9})$/', $number);
                break;
            case 'SI': // SLOVENIA
                $isValid = (bool)preg_match('/^(SI)([1-9]\d{7})$/', $number);
                break;
            case 'SK': // SLOVAK REPUBLIC
                $isValid = (bool)preg_match('/^(SK)([1-9]\d[(2-4)|(6-9)]\d{7})$/', $number);
                break;
            case 'SE': // SWEDEN
                $isValid = (bool)preg_match('/^(SE)(\d{10}01)$/', $number);
                break;
            default:
                $isValid = false;
        }

        // For development environment
        if (!$isValid) {
            $isValid = $number == '1234567890';
        }

        if (!$isValid && $exception) {
            throw new ValidationException(ValidationException::EU_VAT_NUMBER);
        }

        return $isValid;
    }

    public function euCountry($countryCode, $exception = false)
    {
        $valid = Platform::getInstance()->getConfig('EuCountries')->toArray(true)->keyExists($countryCode);
        if (!$valid && $exception) {
            throw new ValidationException(ValidationException::EU_COUNTRY);
        }

        return $valid;
    }

    private function luhn($number)
    {
        // Force the value to be a string as this method uses string functions.
        // Converting to an integer may pass PHP_INT_MAX and result in an error!
        $number = (string)$number;

        if (!ctype_digit($number)) {
            // Luhn can only be used on numbers!
            return false;
        }

        // Check number length
        $length = strlen($number);

        // Checksum of the card number
        $checksum = 0;

        for ($i = $length - 1; $i >= 0; $i -= 2) {
            // Add up every 2nd digit, starting from the right
            $checksum += substr($number, $i, 1);
        }

        for ($i = $length - 2; $i >= 0; $i -= 2) {
            // Add up every 2nd digit doubled, starting from the right
            $double = substr($number, $i, 1) * 2;

            // Subtract 9 from the double where value is greater than 10
            $checksum += ($double >= 10) ? ($double - 9) : $double;
        }

        // If the checksum is a multiple of 10, the number is valid
        return ($checksum % 10 === 0);
    }

    private function getValidators($validators)
    {
        if (is_array($validators)) {
            return $validators;
        } else {
            $validators = func_get_args();
            if (count($validators) == 1 && is_string($validators[0])) {
                $validators = explode(',', $validators[0]);
            }
        }

        return $validators;
    }
}