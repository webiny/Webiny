<?php
namespace Webiny\Core\Services;

use Webiny\Component\Http\HttpTrait;
use Webiny\Component\Rest\RestTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\StdObjectWrapper;

abstract class AbstractService
{
    use RestTrait, HttpTrait, StdLibTrait;

    private $skippedFilters = [
        'XDEBUG_SESSION_START'
    ];

    /**
     * Get query filters
     *
     * @return array
     */
    protected function getFilters()
    {
        $queryFilters = [];
        $filters = $this->restGetFilter(null);

        foreach ($filters as $fName => $fValue) {

            if($fValue === ''){
                continue;
            }

            if (!$this->str($fName)->startsWith('_') && !in_array($fName, $this->skippedFilters)) {
                if (strtolower($fValue) === 'true' || strtolower($fValue) == 'false') {
                    $fValue = StdObjectWrapper::toBool($fValue);
                }
                $queryFilters[$fName] = $fValue;
            }
        }

        $searchFields = $this->httpRequest()->query('_searchFields', null);
        $searchQuery = $this->httpRequest()->query('_searchQuery', null);
        $searchOperator = $this->httpRequest()->query('_searchOperator', 'or');

        if ($searchFields && $searchQuery) {
            // Make sure we have a valid operator
            if (!in_array($searchOperator, ['and', 'or'])) {
                $searchOperator = 'or';
            }

            // Add condition to filters
            foreach (explode(',', $searchFields) as $key) {
                $queryFilters['$' . $searchOperator][][$key] = new \MongoRegex("/" . $searchQuery . "/i");
            }
        }
        
        return $queryFilters;
    }

    /**
     * @return mixed
     */
    protected function getRequestData() {
        $data = $this->httpRequest()->payload();
        if (!$data) {
            $data = $this->httpRequest()->post();
        }
        return $data;
    }
}