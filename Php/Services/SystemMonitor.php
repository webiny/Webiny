<?php
namespace Apps\Core\Php\Services;

use Apps\Core\Php\DevTools\Services\AbstractService;
use Apps\Core\Php\Entities\SystemSnapshot;

/**
 * Class SystemMonitor
 *
 * This service provides data about your server performance
 */
class SystemMonitor extends AbstractService
{
    function __construct()
    {
        parent::__construct();
        $this->api('GET', 'snapshot', function () {
            $snapshot = new SystemSnapshot();

            return ['createdOn' => $this->datetime()->format(DATE_ISO8601), 'stats' => $snapshot->stats];
        });

        $this->api('GET', 'create-snapshot', function () {
            $snapshot = new SystemSnapshot();
            $snapshot->save();

            return ['snapshot' => $snapshot->id];
        })->setPublic();
    }
}