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
        $this->attr('price')->price(10, 200);
        $this->attr('template')->char()->setValidators('required,in:blog:static');
        $this->attr('published')->boolean();
        $this->attr('publishedOn')->datetime()->setValidators('required');
        $this->attr('author')->many2one()->setEntity('Apps\Core\Php\Entities\User')->setValidators('required');
        $this->attr('canComment')->boolean()->setValidators('required');
        $this->attr('settings')->object()->setValidators('required');
        $this->attr('comments')->arr()->setValidators('required');
    }

    protected function entityApi()
    {
        /**
         * @api.name Get User data by given ID
         * @api.url.id char User ID
         */
        $this->api('get', 'getUser', function (User $user) {
            return $this->getUser($user);
        });

        /**
         * @api.name Calculate price
         * @api.url.date date Booking date
         * @api.body.factor integer Price factor
         */
        $this->api('post', 'calculatePrice', function ($date) {
            return $date;
        });
    }

    public function getUser(User $user)
    {
        return 'User: ' . $user->email;
    }
}