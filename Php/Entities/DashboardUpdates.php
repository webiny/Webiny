<?php
namespace Apps\TheHub\Php\Entities;

use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;
use Apps\Webiny\Php\DevTools\WebinyTrait;
use Webiny\Component\Mongo\Index\SingleIndex;

/**
 * Class Updates controls the updates that will be delivered to Webiny Dashboard
 *
 * @package Apps\Webiny\Php\Entities
 *
 */
class DashboardUpdates extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'DashboardUpdates';

    public function __construct()
    {
        parent::__construct();

        $this->index(new SingleIndex('published', 'published'));
        $this->index(new SingleIndex('order', 'order'));

        $this->attr('refId')->char()->setToArrayDefault(true);
        $this->attr('title')->char()->setToArrayDefault(true);
        $this->attr('content')->char()->setToArrayDefault(true);
        $this->attr('link')->char()->setToArrayDefault(true);
        $this->attr('dismissed')->object()->setDefaultValue(false); // this will contain the id of user which dismissed the update
        $this->attr('order')->integer()->setDefaultValue(0);
        $this->attr('image')->char()->setToArrayDefault(true);


        // @todo: every admin user needs to have this access
        // @todo: we need to limit updates to 10
        $this->api('GET', 'latest', function(){
            $result = Updates::find(['published'=>true], ['-order'], 10);
            return $this->apiFormatList($result, '*, image.src');
        });

        // @todo: every admin user needs to have this access
        // @todo: dismiss
        $this->api('GET', '{id}/dismiss', function(){

        });
    }

    // @todo: this should append only new updates to the existing ones
    private function populateUpdates()
    {

    }
}