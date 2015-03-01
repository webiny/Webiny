<?php
namespace Apps\Todo\Common\Php\Entities;

use Webiny\Component\Entity\EntityAbstract;

class TodoTask extends EntityAbstract
{

    protected static $_entityCollection = 'TodoTasks';

    /**
     * This method is called during instantiation to build entity structure
     * @return void
     */
    protected function _entityStructure()
    {
        $this->attr('task')
             ->char()
             ->attr('completed')
             ->boolean()
             ->setDefaultValue(false)
            ->attr('important')
            ->boolean()
            ->setDefaultValue(false)
             ->attr('created')
             ->datetime()
             ->setDefaultValue('now')
            ->attr('settings')
             ->arr()->setDefaultValue([]);
    }
}