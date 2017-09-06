<?php

namespace Apps\Webiny\Php\Lib\Authorization;

use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Apps\Webiny\Php\Entities\User;
use Webiny\Component\Crypt\CryptTrait;

class TwoFactorAuth
{
    use WebinyTrait, CryptTrait;

    private $user;
    private $driverInstance;

    public function __construct(User $user)
    {
        $this->user = $user;
        $this->driverInstance = new \RobThree\Auth\TwoFactorAuth($this->wRequest()->getHostName());
    }

    public function getQrCode()
    {
        return $this->driverInstance->getQRCodeImageAsDataUri($this->user->email, $this->getSecret(), 100);
    }

    public function verifyCode($code)
    {
        $code = preg_replace('/\s+/', '', $code);
        if (strlen($code) === 8) { // recovery code
            $recoveryCodes = $this->getRecoveryCodes();

            foreach ($recoveryCodes as $index => $rc) {
                //echo $code.' => '.$rc."\n";
                if ($rc == $code) {
                    unset($this->user->twoFactorAuth['recoveryCodes'][$index]);
                    $this->user->save();

                    return true;
                }
            }

        } elseif (strlen($code) === 6) { // authenticator
            return $this->driverInstance->verifyCode($this->getSecret(), $code);
        }

        return false;
    }

    public function populateRecoveryCodes($num = 10)
    {
        $recoveryCodes = [];

        for ($i = 0; $i < $num; $i++) {
            $recoveryCodes[] = $this->encryptString(strtoupper($this->crypt()->generateUserReadableString(8)));
        }

        // when we populate the secret, we also populate the recovery codes
        $this->user->twoFactorAuth['recoveryCodes'] = $recoveryCodes;

        // save changes
        $this->user->save();
    }

    public function getVerificationToken($authToken)
    {
        return $this->encryptString($authToken, $this->getSecret());
    }

    public function getAuthToken($verificationToken)
    {
        return $this->decryptString($verificationToken, $this->getSecret());
    }

    public function getRecoveryCodes()
    {
        $recoveryCodes = [];
        $userCodes = $this->user->twoFactorAuth['recoveryCodes'];

        foreach ($userCodes as $rc) {
            $recoveryCodes[] = $this->decryptString($rc);
        }

        return $recoveryCodes;
    }

    private function getSecret()
    {
        $secret = isset($this->user->twoFactorAuth['secret']) ? $this->user->twoFactorAuth['secret'] : '';

        if ($secret == '') {
            // if secret is not set, we populate the secret
            $secret = $this->driverInstance->createSecret();
            $this->user->twoFactorAuth['secret'] = $this->encryptString($secret);

            // save the changes
            $this->user->save();
        } else {
            $secret = $this->decryptString($secret);
        }

        if (!$secret) {
            throw new AppException('Unable to generate or retrieve the 2 factor auth secret.');
        }

        return $secret;
    }

    private function encryptString($str, $salt = '')
    {
        return $this->crypt()->encrypt($str, $this->getKey($salt));
    }

    private function decryptString($str, $salt = '')
    {
        return $this->crypt()->decrypt($str, $this->getKey($salt));
    }

    private function getKey($salt = '')
    {
        $key = $this->wConfig()->get('Security.TwoFactorAuth.Key');
        if (!$key) {
            throw new AppException('2 factor auth key is not set under Security.TwoFactorAuth.Key');
        }

        return md5($this->user->password . $key . $salt);
    }

}