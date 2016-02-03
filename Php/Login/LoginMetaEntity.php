<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */
namespace Apps\Core\Php\Login;

/**
 * Class LoginSessionEntity
 * @package Apps\Core\Php\Login
 */
class LoginMetaEntity extends \Webiny\Component\Entity\EntityAbstract
{
    protected static $entityCollection = "LoginMeta";

    /**
     * This method is called during instantiation to build entity structure
     * @return void
     */
    protected function entityStructure()
    {
        $this->attr('username')->char()
            ->attr("loginAttempts")->arr()
            ->attr("allowedDevices")->arr()
            ->attr("sessions")->arr()
            ->attr("blocked")->boolean()->setDefaultValue(false)
            ->attr("confirmed")->boolean()->setDefaultValue(false)
            ->attr("confirmationToken")->char()
            ->attr("lastLogin")->integer()
            ->attr("forgotPasswordToken")->char();
    }
}