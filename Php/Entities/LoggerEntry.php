<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\Entity\AbstractEntity;


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
class LoggerEntry extends AbstractEntity
{

    protected static $entityCollection = 'LoggerEntry';
    protected static $entityMask = '{id}';

    public function __construct()
    {
        parent::__construct();
        
        $this->attr('url')->char()->setToArrayDefault();
        $this->attr('date')->datetime()->setToArrayDefault();

        $this->attr('stack')->char();
        $this->attr('clientData')->object();

        $this->attr('errorGroup')->many2one()->setEntity('Apps\Core\Php\Entities\LoggerErrorGroup');
    }
}