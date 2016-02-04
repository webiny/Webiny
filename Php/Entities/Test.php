<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Apps\Core\Php\DevTools\Request;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

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

        $this->expose('bang', function(Request $request, $result){
            return $result->toArray($request->getFields());
        });
    }

    public static function bang(ArrayObject $get, ArrayObject $post)
    {
        return [
            'get'  => $get->val(),
            'post' => $post->val()
        ];
    }
}