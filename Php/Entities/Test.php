<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Webiny\Component\Mongo\Index\SingleIndex;

/**
 * Class Test
 *
 * @property string $name
 *
 * @package Apps\Core\Php\Entities
 *
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
    }

    public static function bang()
    {
        return 'Bang!';
    }
}