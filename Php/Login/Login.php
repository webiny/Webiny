<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Login;

use Webiny\Component\Config\ConfigObject;
use Webiny\Component\Crypt\CryptTrait;
use Webiny\Component\Http\HttpTrait;
use Webiny\Component\Security\Security;
use Webiny\Component\Security\SecurityTrait;

/**
 * Login class holds all the login logic.
 *
 * @package Apps\Core\Php\Login
 */
class Login
{
    use HttpTrait, CryptTrait, SecurityTrait;

    /**
     * @var int default session ttl - used if session ttl is not defined inside login config
     */
    private $defaultSessionTtl = 30; // in days
    /**
     * @var int default device ttl - used if device ttl is not defined inside login config
     */
    private $defaultDeviceTtl = 60; // in days

    /**
     * @var Security
     */
    private $security;
    /**
     * @var ConfigObject Login config.
     */
    private $config;
    /**
     * @var string Name of the firewall that will be used for authentication.
     */
    private $fwName;

    /**
     * @var string Current authentication token.
     */
    private $authToken;

    /**
     * Array of LoginMetaEntity objects by username
     * @var array
     */
    private $meta;

    /**
     * @var string Current username.
     */
    private $username;

    /**
     * @var string Current user ip.
     */
    private $ip;


    /**
     * Base constructor.
     *
     * @param Security     $security
     * @param ConfigObject $config
     *
     * @throws LoginException
     */
    public function __construct(Security $security, ConfigObject $config)
    {
        $this->security = $security;
        $this->config = $config;

        // extract the firewall from the config
        $this->fwName = $this->config->get('SecurityFirewall', false);
        if (!$this->fwName) {
            throw new LoginException("SecurityFirewall must be defined inside the login configuration.");
        }
        $this->ip = $this->httpRequest()->getClientIp();
    }

    /**
     * Check if current IP should be blocked from login page
     */
    public function rateLimitReached()
    {
        if ($this->isIpWhitelisted()) {
            return false; // we cannot block whitelisted IPs
        }

        if ($this->isIpBlacklisted()) {
            return true;
        }

        $rateLimit = $this->config->get('BlockThreshold', 0);
        if ($rateLimit < 1) {
            return false; // rate limit not used
        }

        // get the last record that's on the end of the rate limit window
        $rc = LoginRateControlEntity::find(['ip' => $this->ip], ['-timestamp'], 1, $rateLimit);
        if (!$rc) {
            return false;
        }

        $blockTtl = $this->config->get('BlockTimelimit', 1) * 60; // defined in minutes, cast to seconds
        if ((time() - $blockTtl) > 60) {
            return false;
        }

        return true;
    }

    /**
     * Removes all valid user sessions.
     * (causes the user to login again)
     *
     * @param string $username
     * @param string $session In case you want to revoke a particular session.
     *
     * @throws LoginException
     */
    public function revokeSessions($username, $session = '')
    {
        $this->username = $username;
        if ($session == '') {
            $newSessions = [];
        } else {
            $sessions = $this->getMeta()->sessions;

            $newSessions = [];
            foreach ($sessions as $s) {
                if ($s['sid'] != $session) {
                    $newSessions[] = $s;
                }
            }
        }

        $this->getMeta()->sessions = $newSessions;
        $this->getMeta()->save();
    }

    /**
     * Generates a unique token to authenticate the current device for the given username.
     *
     * @param $username
     *
     * @return string
     * @throws LoginException
     * @throws \Webiny\Component\Crypt\CryptException
     */
    public function generateDeviceValidationToken($username)
    {
        $this->username = $username;
        $validationToken = $this->crypt()->generateRandomString(6, '0123456789');

        $devices = $this->getMeta()->allowedDevices;

        $devices[] = [
            'device'          => $this->getDeviceFingerprint(),
            'created'         => 0,
            'token'           => '',
            'validationToken' => $validationToken,
            'confirmed'       => false
        ];

        $this->getMeta()->allowedDevices = $devices;
        $this->getMeta()->save();

        return $validationToken;
    }

    /**
     * Checks if the provided token matches a device validation token in the database for the given username.
     * If token matches, the given device is now allowed access.
     *
     * @param $username
     * @param $token
     *
     * @return bool|string
     * @throws LoginException
     * @throws \Webiny\Component\Crypt\CryptException
     */
    public function validateDeviceConfirmationToken($username, $token)
    {
        $this->username = $username;

        if ($this->rateLimitReached()) {
            throw new LoginException('The current user session is block from login page.', 1);
        }

        $allowedList = $this->getMeta()->allowedDevices->val();
        if (!is_array($allowedList)) {
            return false;
        }

        $newAllowedList = $allowedList;
        $deviceId = $this->getDeviceFingerprint();
        $i = 0;
        foreach ($allowedList as $al) {
            if ($al['confirmed'] == false && $al['device'] == $deviceId && $token == $al['validationToken']) {
                $token = $this->crypt()->generateUserReadableString(32);
                $newAllowedList[$i]['confirmed'] = true;
                $newAllowedList[$i]['created'] = time();
                $newAllowedList[$i]['token'] = $token;


                $this->getMeta()->allowedDevices = $newAllowedList;
                $this->getMeta()->save();

                return $token;
            }
            $i++;
        }

        // validation cleanup (if validation was unsuccessful, we need to delete the token, a new one needs to be requested)
        $newAllowedList = [];
        foreach ($allowedList as $al) {
            if ($al['confirmed'] != false) {
                $newAllowedList[] = $al;
            }
        }
        $this->getMeta()->allowedDevices = $newAllowedList;
        $this->getMeta()->save();

        // increment login count
        $this->incrementLoginAttempts();

        return false;
    }

    /**
     * Removes all authorized user devices for the given user account.
     * (causes the user to login again if they are using 2FA)
     *
     * @param string $username
     * @param string $deviceToken In case if you want to revoke access for a particular device.
     *
     * @throws LoginException
     */
    public function revokeDevices($username, $deviceToken = '')
    {
        $this->username = $username;

        if ($deviceToken == '') {
            $newDevices = [];
        } else {
            $devices = $this->getMeta()->allowedDevices;

            $newDevices = [];
            foreach ($devices as $d) {
                if ($d['token'] != $deviceToken) {
                    $newDevices[] = $d;
                }
            }
        }

        $this->getMeta()->allowedDevices = $newDevices;
        $this->getMeta()->save();
    }

    /**
     * Checks if user account is active.
     *
     * @param string $username
     *
     * @return \Webiny\Component\Entity\Attribute\AttributeAbstract
     * @throws LoginException
     */
    public function isAccountActive($username)
    {
        $this->username = $username;

        return $this->getMeta()->confirmed;
    }

    /**
     * Checks if user account is blocked.
     *
     * @param string $username
     *
     * @return \Webiny\Component\Entity\Attribute\AttributeAbstract
     * @throws LoginException
     */
    public function isAccountBlocked($username)
    {
        $this->username = $username;

        return $this->getMeta()->blocked;
    }

    /**
     * Change the `blocked` user account status flag.
     *
     * @param      $username
     * @param bool $blocked
     *
     * @throws LoginException
     */
    public function setUserBlockedStatus($username, $blocked = true)
    {
        $this->username = $username;
        $this->getMeta()->blocked = $blocked;
        $this->getMeta()->save();
    }

    /**
     * Generates a token used to confirm/activate the account.
     *
     * @return string
     * @throws LoginException
     * @throws \Webiny\Component\Crypt\CryptException
     */
    public function getAccountConfirmationToken($username)
    {
        $this->username = $username;

        $token = $this->crypt()->generateUserReadableString(32);
        $this->getMeta()->confirmationToken = $token;
        $this->getMeta()->save();

        return $token;
    }

    /**
     * If the provided token matches the given username, the users account is set into "activated" state.
     *
     * @param string $username
     * @param string $token Token provided by getAccountConfirmationToken method.
     *
     * @return bool
     * @throws LoginException
     */
    public function validateAccountConfirmationToken($username, $token)
    {
        $this->username = $username;

        if ($this->getMeta()->confirmationToken == $token) {
            $this->getMeta()->confirmed = true;
            $this->getMeta()->confirmationToken = '';
            $this->getMeta()->save();

            return true;
        }

        return false;
    }

    /**
     * Change the `confirmed` user account status flag.
     *
     * @param      $username
     * @param bool $confirmed
     *
     * @throws LoginException
     */
    public function setUserAccountConfirmationStatus($username, $confirmed = true)
    {
        $this->username = $username;
        $this->getMeta()->confirmed = $confirmed;
        $this->getMeta()->save();
    }

    /**
     * Generates a token used to confirm/activate the account.
     *
     * @return string
     * @throws LoginException
     * @throws \Webiny\Component\Crypt\CryptException
     */
    public function getForgotPasswordToken($username)
    {
        $this->username = $username;

        $token = $this->crypt()->generateUserReadableString(32);
        $this->getMeta()->forgotPasswordToken = $token;
        $this->getMeta()->save();

        return $token;
    }

    /**
     * If the provided token matches the given username, the users account is set into "activated" state.
     *
     * @param string $username
     * @param string $token Token provided by getAccountConfirmationToken method.
     *
     * @return bool
     * @throws LoginException
     */
    public function validateForgotPasswordToken($username, $token)
    {
        $this->username = $username;

        if ($this->getMeta()->forgotPasswordToken == $token) {
            $this->getMeta()->forgotPasswordToken = '';
            $this->getMeta()->save();

            return true;
        }

        return false;
    }

    /**
     * Processes the login request.
     * If successful, it returns the user object, otherwise LoginException is thrown:
     * Code | Message
     * --------------
     * 1      Rate limit reached.
     * 2      User account is blocked.
     * 3      Invalid credentials.
     * 4      User hasn't confirmed his account.
     * 5      The current device is not on the allowed list.
     *
     * @param string $username
     * @param string $deviceToken
     * @param string $authProvider
     *
     * @return bool
     * @throws LoginException
     * @throws \Webiny\Component\Security\Authentication\FirewallException
     * @throws \Webiny\Component\Security\SecurityException
     */
    public function processLogin($username, $deviceToken = '', $authProvider = '')
    {
        $this->username = $username;

        // check if rate limit is reached for the current ip
        if ($this->rateLimitReached()) {
            throw new LoginException('Rate limit reached.', 1);
        }

        // check if user account is blocked
        if ($this->isAccountBlocked($this->username)) {
            throw new LoginException('User account is blocked.', 2);
        }

        $result = $this->security->firewall($this->fwName)->processLogin($authProvider);

        // unsuccessful login
        if (!$result) {
            $this->incrementLoginAttempts();

            throw new LoginException('Invalid credentials.', 3);
        }

        // successful login
        $this->authToken = $this->security($this->fwName)->getToken()->getTokenString();

        //is user account active (confirmed)
        if (!$this->isAccountActive($this->username)) {
            $this->security->firewall($this->fwName)->processLogout();
            throw new LoginException('User hasn\'t confirmed his account.', 4);
        }

        // validate device allowed list
        if ($this->config->get('2FactorAuth', true)) {
            // validate the device
            if (!$this->isDeviceSessionValid($deviceToken)) {
                $this->security->firewall($this->fwName)->processLogout();
                throw new LoginException('The current device is not on the allowed list.', 5);
            }
        }

        // store the auth token
        $this->storeUserSession($this->authToken);

        // cleanup
        $this->resetRateLimit();

        // should return the user object
        return $result;
    }

    /**
     * Returns User object for the provided auth token and device token.
     * If user is not found, or session is invalid, an exception is thrown.
     *
     * @param $authToken
     * @param $deviceToken
     *
     * @return bool|\Webiny\Component\Security\User\UserAbstract
     * @throws LoginException
     * @throws \Webiny\Component\Security\Authentication\FirewallException
     * @throws \Webiny\Component\Security\SecurityException
     */
    public function getUser($authToken, $deviceToken = '')
    {
        // 1. get user from firewall
        $this->security($this->fwName)->getToken()->setTokenString($authToken);
        $user = $this->security($this->fwName)->getUser();

        if (!$user->isAuthenticated()) {
            throw new LoginException('User is not authenticated', 6);
        }

        // 2. extract username
        $this->username = $user->getUsername();

        // do the checks
        if ($this->isAccountBlocked($this->username)) {
            $this->security->firewall($this->fwName)->processLogout();
            throw new LoginException('User account is blocked.', 2);
        }
        if (!$this->isAccountActive($this->username)) {
            $this->security->firewall($this->fwName)->processLogout();
            throw new LoginException('User hasn\'t confirmed his account.', 4);
        }
        if ($this->config->get('2FactorAuth', true)) {
            // validate the device
            if (!$this->isDeviceSessionValid($deviceToken)) {
                $this->security->firewall($this->fwName)->processLogout();
                //todo: invalidate session in login meta
                throw new LoginException('The device session is no longer valid.', 8);
            }
        }

        // is session still valid
        if (!$this->isSessionValid($authToken)) {
            $this->security->firewall($this->fwName)->processLogout();
            throw new LoginException('The current auth session is no longer valid.', 7);
        }

        // return User
        return $user;
    }

    /**
     * Returns the current auth token.
     *
     * @return string
     */
    public function getAuthToken()
    {
        return $this->authToken;
    }

    /**
     * Triggers logout on the firewall and invalidates the given auth token (session).
     *
     * @param $authToken
     *
     * @throws LoginException
     * @throws \Webiny\Component\Security\Authentication\FirewallException
     */
    public function logout($authToken)
    {
        // get user from firewall
        $this->security($this->fwName)->getToken()->setTokenString($authToken);
        $user = $this->security($this->fwName)->getUser();
        if (!$user->isAuthenticated()) {
            throw new LoginException('User is not authenticated', 6);
        }

        // extract username
        $this->username = $user->getUsername();

        // logout on firewall
        $this->security($this->fwName)->processLogout();

        // delete the session
        $this->revokeSessions($this->username, $authToken);
    }

    /**
     * @return ConfigObject
     */
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * Generates a device fingerprint.
     *
     * @return string
     * @throws LoginException
     */
    private function getDeviceFingerprint()
    {
        $server = $this->httpRequest()->server();

        $did = '';
        //$did .= $server->httpAccept();
        //$did .= '|' . $server->httpAcceptCharset();
        //$did .= '|' . $server->httpAcceptEncoding();
        $did .= '|' . $server->httpAcceptLanguage();

        // append browser details
        if (empty($server->httpUserAgent())) {
            throw new LoginException('Unable to process the request without a user agent', 100);
        }

        $platform = 'unknown';
        $ub = 'unknown';

        // get the platform
        $ua = $server->httpUserAgent();
        if (preg_match('/linux/i', $ua)) {
            $platform = 'linux';
        } elseif (preg_match('/macintosh|mac os x/i', $ua)) {
            $platform = 'mac';
        } elseif (preg_match('/windows|win32/i', $ua)) {
            $platform = 'windows';
        }

        // get browser name
        if (preg_match('/MSIE/i', $ua) && !preg_match('/Opera/i', $ua)) {
            $ub = "MSIE";
        } elseif (preg_match('/Firefox/i', $ua)) {
            $ub = "Firefox";
        } elseif (preg_match('/Chrome/i', $ua)) {
            $ub = "Chrome";
        } elseif (preg_match('/Safari/i', $ua)) {
            $ub = "Safari";
        } elseif (preg_match('/Opera/i', $ua)) {
            $ub = "Opera";
        } elseif (preg_match('/Netscape/i', $ua)) {
            $ub = "Netscape";
        }

        $did .= '|' . $platform;
        $did .= '|' . $ub;

        return md5($did);
    }

    /**
     * Returns the login meta (username based).
     *
     * @return null|\Webiny\Component\Entity\EntityAbstract|LoginRateControlEntity
     * @throws LoginException
     */
    private function getMeta()
    {
        if (isset($this->meta[$this->username])) {
            return $this->meta[$this->username];
        }

        if (empty($this->username)) {
            throw new LoginException('Unable to load login meta because the username is not set.');
        }

        $meta = LoginMetaEntity::findOne(['username' => $this->username]);

        if (!$meta) {
            $meta = new LoginMetaEntity();
            $meta->username = $this->username;
        }

        $this->meta[$this->username] = $meta;

        return $meta;
    }

    /**
     * Checks if the given session is still valid.
     *
     * @param $session
     *
     * @return bool
     * @throws LoginException
     */
    private function isSessionValid($session)
    {
        $sessions = $this->getMeta()->sessions;
        $sessionTtl = $this->config->get('SessionTtl', $this->defaultSessionTtl);

        foreach ($sessions as $s) {
            if ($s['sid'] == $session && ($s['created'] + (86400 * $sessionTtl)) > time()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if the given device token is still valid.
     *
     * @param $deviceToken
     *
     * @return bool
     * @throws LoginException
     */
    private function isDeviceSessionValid($deviceToken)
    {
        $devices = $this->getMeta()->allowedDevices;
        $deviceTtl = $this->config->get('DeviceTtl', $this->defaultDeviceTtl);

        $currentDeviceFingerprint = $this->getDeviceFingerprint();

        foreach ($devices as $d) {
            if ($d['token'] == $deviceToken && ($d['created'] + (86400 * $deviceTtl)) > time() && $d['device'] == $currentDeviceFingerprint) {
                return true;
            }
        }

        return false;
    }

    /**
     * Increments the number of login attempts for the current username and IP.
     */
    private function incrementLoginAttempts()
    {
        $rc = new LoginRateControlEntity();
        $rc->ip = $this->ip;
        $rc->username = $this->username;
        $rc->timestamp = time();
        $rc->save();
    }

    /**
     * Resets the rate limit for the current ip and username.
     * It also clears the records that are older than 30 days.
     */
    private function resetRateLimit()
    {
        // clear the logs for the current ip/username combo
        LoginRateControlEntity::find(['ip' => $this->ip, 'username' => $this->username])->delete();

        // delete all records older than 30 days
        $ts = time() - (30 * 86400);
        LoginRateControlEntity::find([
            'timestamp' => [
                '$lt' => [$ts]
            ]
        ])->delete();
    }

    /**
     * Checks if the current ip is whitelisted.
     *
     * @return bool
     */
    private function isIpWhitelisted()
    {
        $whitelist = $this->config->get('RateLimitWhitelist', [], true);
        if (in_array($this->ip, $whitelist)) {
            return true;
        }

        return false;
    }

    /**
     * Checks if the current ip is black listed.
     *
     * @return bool
     */
    private function isIpBlacklisted()
    {
        $blacklist = $this->config->get('RateLimitBlacklist', [], true);
        if (in_array($this->ip, $blacklist)) {
            return true;
        }

        return false;
    }

    /**
     * Stores a new active session for the current user.
     *
     * @param string $session
     *
     * @throws LoginException
     */
    private function storeUserSession($session)
    {
        // get all sessions
        $sessions = $this->getMeta()->sessions;
        if (!is_array($session)) {
            $sessions = [];
        }

        // delete the old sessions
        $newSessions = [];
        $ttl = $this->config->get('SessionTtl', $this->defaultSessionTtl);
        foreach ($sessions as $s) {
            if (($s['created'] + ($ttl * 86400)) > time()) {
                $newSessions[] = $s;
            }
        }

        // append the new session
        $newSessions[] = ['sid' => $session, 'created' => time(), 'ip' => $this->ip];

        // update the last login date
        $this->getMeta()->lastLogin = time();

        // append a new login attempt
        $this->getMeta()->loginAttempts[] = ['ip' => $this->ip, 'timestamp' => time()];

        // update the entity
        $this->getMeta()->sessions = $newSessions;
        $this->getMeta()->save();
    }
}