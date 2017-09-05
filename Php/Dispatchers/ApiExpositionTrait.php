<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Dispatchers;

use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Response\EntityResponse;
use Apps\Webiny\Php\Lib\Response\ListResponse;
use Apps\Webiny\Php\RequestHandlers\ApiException;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\Router\Route\Route;

/**
 * Trait ApiExpositionTrait
 *
 * This class is used when we want to expose entity or service methods to the API
 *
 * @package Apps\Webiny\Php\Dispatchers
 */
trait ApiExpositionTrait
{
    protected $processingEvent = null;

    /**
     * @var array
     */
    protected $apiMethods = [];

    /**
     * Format given EntityCollection using $fields into a standard list response
     *
     * @param EntityCollection $collection
     * @param string           $fields
     *
     * @return ListResponse
     */
    public static function apiFormatList(EntityCollection $collection, $fields)
    {
        $perPage = $collection->getLimit();
        $offset = $collection->getOffset();
        $page = 1;
        if ($offset > 0) {
            $page = ($offset / $perPage) + 1;
        }

        return new ListResponse([
            'meta' => [
                'totalCount'  => $collection->totalCount(),
                'totalPages'  => $perPage > 0 ? ceil($collection->totalCount() / $perPage) : 1,
                'perPage'     => $perPage,
                'currentPage' => $page,
                'fields'      => $fields
            ],
            'list' => $collection->toArray($fields)
        ]);
    }

    /**
     * Format given Entity using $fields into a standard entity response
     *
     * @param AbstractEntity $entity
     * @param string         $fields
     *
     * @return EntityResponse
     */
    public static function apiFormatEntity(AbstractEntity $entity, $fields)
    {
        return new EntityResponse([
            'meta'   => [
                'fields' => $fields
            ],
            'entity' => $entity->toArray($fields)
        ]);
    }

    /**
     *
     * @param string $httpMethod
     * @param string $url
     *
     * @return MatchedApiMethod
     */
    public function getApiMethod($httpMethod, $url)
    {
        $httpMethod = strtolower($httpMethod);
        $methods = $this->apiMethods[$httpMethod] ?? [];

        uksort($methods, function ($a, $b) {
            if ($a[0] === '{' && $b[0] !== '{') {
                return 1;
            }

            $position = -($this->str($a)->explode('/')->count() <=> $this->str($b)->explode('/')->count());
            if ($position !== 0) {
                return $position;
            }

            // Compare number of variables
            return $this->str($a)->subStringCount('{') <=> $this->str($b)->subStringCount('{');
        });

        if ($url === '' && isset($methods['/'])) {
            return new MatchedApiMethod($methods['/'], []);
        }

        /* @var $method ApiMethod */
        foreach ($methods as $pattern => $method) {
            if ($pattern === '/') {
                continue;
            }
            $route = new Route($pattern, null);
            $compiled = $route->compile();
            $regex = $compiled->getRegex();

            $regex = str_replace('[\w-]', '[\w-\.]', $regex);

            // Add a ^ to force regex from the beginning of URL
            $regex = '#^' . ltrim($regex, '#');

            if (preg_match($regex, $url, $matches)) {
                $params = [];
                foreach ($compiled->getVariables() as $index => $v) {
                    $params[$v['name']] = $matches[$index + 1];
                }

                return new MatchedApiMethod($method, $params);
            }
        }

        return null;
    }

    public function getApiMethods()
    {
        return $this->apiMethods;
    }

    /**
     * Expose new API method or get instance of existing method
     *
     * @param string   $httpMethod
     * @param string   $pattern
     * @param callable $callable
     *
     * @return ApiMethod
     * @throws ApiException
     */
    public function api($httpMethod, $pattern, $callable = null)
    {
        $pattern = $pattern != '/' ? trim($pattern, '/') : '/';
        $httpMethod = strtolower($httpMethod);

        if ($callable && !isset($this->apiMethods[$httpMethod])) {
            $this->apiMethods[$httpMethod] = [];
        }
        
        if ($callable) {
            if (isset($this->apiMethods[$httpMethod][$pattern])) {
                $apiInstance = $this->apiMethods[$httpMethod][$pattern];
            } else {
                $apiInstance = new ApiMethod($httpMethod, $pattern, $this);
            }

            $apiInstance->addCallback($callable, $this->processingEvent);
            $this->apiMethods[$httpMethod][$pattern] = $apiInstance;
        } else {
            $apiInstance = $this->apiMethods[$httpMethod][$pattern] ?? null;
        }

        return $apiInstance;
    }
}