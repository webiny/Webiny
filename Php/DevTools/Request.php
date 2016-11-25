<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools;

use Webiny\Component\Rest\RestTrait;
use Webiny\Component\StdLib\StdObject\StdObjectWrapper;

/**
 * Provides you with access to an object containing the data about current request
 */
class Request extends \Webiny\Component\Http\Request
{
    use RestTrait;

    private $skipFilters = [
        'XDEBUG_SESSION_START'
    ];

    /**
     * Is it a request to an API?
     *
     * @return bool
     */
    public function isApi()
    {
        $url = $this->getCurrentUrl();
        if (!$this->str($url)->startsWith(Config::getInstance()->get('Application.ApiPath'))) {
            return false;
        }

        return true;
    }

    public function hasSystemToken()
    {
        $requestToken = urldecode($this->header('X-Webiny-Api-Token'));
        if (!$requestToken) {
            $requestToken = $this->query('apiToken');
        }

        $systemToken = Config::getInstance()->get('Application.Acl.Token');
        if ($systemToken && $systemToken === $requestToken) {
            return true;
        }

        return false;
    }

    /**
     * Get query filters
     *
     * @return array
     */
    public function getFilters()
    {
        $queryFilters = [];
        $filters = $this->query();

        foreach ($filters as $fName => $fValue) {

            if ($fValue === '') {
                continue;
            }

            if (!$this->str($fName)->startsWith('_') && !in_array($fName, $this->skipFilters)) {
                if (is_string($fValue) && (strtolower($fValue) === 'true' || strtolower($fValue) == 'false')) {
                    $fValue = StdObjectWrapper::toBool($fValue);
                }
                if (is_numeric($fValue)) {
                    $fValue = strpos($fValue, '.') > 0 ? floatval($fValue) : intval($fValue);
                }
                $queryFilters[$fName] = $fValue;
            }
        }

        $searchFields = $this->query('_searchFields', null);
        $searchQuery = $this->query('_searchQuery', null);
        $searchOperator = $this->query('_searchOperator', 'or');

        if ($searchFields && $searchQuery) {
            // Make sure we have a valid operator
            if (!in_array($searchOperator, ['and', 'or'])) {
                $searchOperator = 'or';
            }

            // Add condition to filters
            foreach (explode(',', $searchFields) as $key) {
                $queryFilters['$' . $searchOperator][][$key] = new \MongoDB\BSON\Regex($searchQuery, 'i');
            }
        }

        return $queryFilters;
    }

    /**
     * @return mixed
     */
    public function getRequestData()
    {
        $data = $this->payload();
        if (!$data) {
            $data = $this->post();
        }

        return $data;
    }

    public static function getPage($default = 1)
    {
        return static::restGetPage($default);
    }

    public static function getPerPage($default = 10)
    {
        return static::restGetPerPage($default);
    }

    public static function getSortField($default = false)
    {
        return static::restGetSortField($default);
    }

    public static function getSortFields($default = [])
    {
        return static::restGetSortFields($default);
    }

    public static function getSortDirection($default = 1)
    {
        return static::getSortDirection($default);
    }

    public static function getFields($default = '')
    {
        return static::restGetFields($default);
    }

    public static function getFilter($name, $default = null)
    {
        return static::restGetFilter($name, $default);
    }
}
