<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */
namespace Apps\Core\Php\Login;

/**
 * Class LoginRateControlEntity
 * @package Apps\Core\Php\Login
 */
class LoginRateControlEntity extends \Webiny\Component\Entity\EntityAbstract
{
    protected static $entityCollection = "LoginRateControl";

    /**
     * This method is called during instantiation to build entity structure
     * @return void
     */
    protected function entityStructure()
    {
        /*
        {
            "ip": 123,
            "timestamp": 10123123,
            "username": john
        }
        */

        $this->attr("ip")->char()
            ->attr("timestamp")->integer()->setDefaultValue(0)
            ->attr("username")->char();
    }
}