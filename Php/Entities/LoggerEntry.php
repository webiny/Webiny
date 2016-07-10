<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class LoggerEntry
 *
 * @property string $url
 * @property date   $date
 * @property char   $stack
 * @property char   $clientData
 *
 * @package Apps\Core\Php\Entities
 *
 */
class LoggerEntry extends EntityAbstract
{

    protected static $entityCollection = 'LoggerEntry';
    protected static $entityMask = '{id}';

    public function __construct()
    {
        parent::__construct();
        
        $this->attr('url')->char()->setToArrayDefault();
        $this->attr('date')->datetime()->setToArrayDefault();
        $this->attr('stack')->char();
        $this->attr('clientData')->char();
    }
}