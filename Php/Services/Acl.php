<?php

namespace Apps\Webiny\Php\Services;

use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\DevTools\Services\AbstractService;
use Apps\Webiny\Php\Entities\ApiTokenLog;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class Acl
 * @package Apps\Webiny\Php\Services
 */
class Acl extends AbstractService
{
    use WebinyTrait, StdLibTrait;

    function __construct()
    {
        parent::__construct();
        /**
         * @api.name Get system API token
         * @api.description Returns a system API token for use with 3rd party requests
         */
        $this->api('get', '/token', function () {
            return ['token' => $this->wConfig()->get('Application.Acl.Token')];
        });

        /**
         * @api.name Get system API token logs
         * @api.description Returns a list of logs for system API token
         */
        $this->api('get', '/token-logs', function () {
            $query = $this->wRequest()->getFilters();
            $query['token'] = 'system';

            $sort = $this->wRequest()->getSortFields();
            $limit = $this->wRequest()->getPerPage();
            $page = $this->wRequest()->getPage();

            $logs = ApiTokenLog::find($query, $sort, $limit, $page);

            return $this->apiFormatList($logs, $this->wRequest()->getFields());
        });
    }
}