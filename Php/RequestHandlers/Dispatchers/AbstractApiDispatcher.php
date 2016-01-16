<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\RequestHandlers\Dispatchers;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Response\ApiErrorResponse;
use Webiny\Component\Rest\RestTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\StdObjectWrapper;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

abstract class AbstractApiDispatcher
{
    use DevToolsTrait, StdLibTrait, RestTrait;

    private $skippedFilters = [
        'XDEBUG_SESSION_START'
    ];

    protected function parseUrl(StringObject $url)
    {
        $parts = $url->trim('/')->explode('/', 3);

        if ($parts->count() < 2) {
            return new ApiErrorResponse([], 'Not enough parameters to dispatch API request!');
        }

        $data = [
            'app' => $this->toPascalCase($parts[0]),
            'class' => $this->toPascalCase($parts[1]),
            'params' => $this->str($parts->key(2, '', true))->explode('/')->filter()->val()
        ];

        return $data;
    }

    /**
     * Get query filters
     *
     * @return array
     */
    protected function getFilters()
    {
        $queryFilters = [];
        $filters = $this->wRequest()->query();

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

        $searchFields = $this->wRequest()->query('_searchFields', null);
        $searchQuery = $this->wRequest()->query('_searchQuery', null);
        $searchOperator = $this->wRequest()->query('_searchOperator', 'or');

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
        $data = $this->wRequest()->payload();
        if (!$data) {
            $data = $this->wRequest()->post();
        }
        return $data;
    }

    protected function toCamelCase($str)
    {
        return $this->str($this->toPascalCase($str))->caseFirstLower()->val();
    }

    protected function toPascalCase($str)
    {
        return $this->str($str)->replace('-', ' ')->caseWordUpper()->replace(' ', '')->val();
    }
}