<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\DevTools;

use Webiny\Component\Mailer\MailerTrait;
use Webiny\Component\StdLib\SingletonTrait;

/**
 * Mailer class.
 *
 * This class is a wrapper for Mailer component
 *
 */
class Mailer
{
    use SingletonTrait, MailerTrait;

    public function getMailer($name = 'Default')
    {
        return $this->mailer($name);
    }
}
