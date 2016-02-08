<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Apps\Core\Php\DevTools\Request;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class Test
 *
 * @property string $name Your name
 *
 * @package Apps\Core\Php\Entities
 */
class Test extends EntityAbstract
{

    protected static $entityCollection = 'Tests';
    protected static $entityMask = '{name}';

    /**
     * This method is called during instantiation to build entity structure
     * @return void
     */
    protected function entityStructure()
    {
        $this->attr('name')->char()->setValidators('required');
        $this->attr('nesto')->price(10, 200);
    }

    protected function entityApi()
    {
        $this->api('get', 'getUser', function (User $user) {
            return $this->getUser($user);
        });
    }

    public function getUser(User $user)
    {
        return 'user: ' . $user->email;
    }
}