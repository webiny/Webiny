<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Dispatchers;

use Apps\Webiny\Php\RequestHandlers\ApiException;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\Router\Route\Route;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

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
     * @var ArrayObject
     */
    private $apiMethods;

    /**
     * Format given EntityCollection using $fields into a standard list response
     *
     * @param EntityCollection $collection
     * @param string           $fields
     *
     * @return array
     */
    public static function apiFormatList(EntityCollection $collection, $fields)
    {
        $perPage = $collection->getLimit();
        $offset = $collection->getOffset();
        $page = 1;
        if ($offset > 0) {
            $page = ($offset / $perPage) + 1;
        }

        return [
            'meta' => [
                'totalCount'  => $collection->totalCount(),
                'totalPages'  => $perPage > 0 ? ceil($collection->totalCount() / $perPage) : 1,
                'perPage'     => $perPage,
                'currentPage' => $page
            ],
            'list' => $collection->toArray($fields)
        ];

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
        if (!$this->apiMethods) {
            $this->apiMethods = new ArrayObject();
        }

        $httpMethod = strtolower($httpMethod);
        $methods = $this->apiMethods->key($httpMethod) ?? [];

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
        if (!$this->apiMethods) {
            $this->apiMethods = new ArrayObject();
        }

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
        if (!$this->apiMethods) {
            $this->apiMethods = new ArrayObject();
        }

        if ($this->str($pattern)->contains('.')) {
            throw new ApiException('Use of "." character in URL pattern is not allowed!');
        }

        $pattern = $pattern != '/' ? trim($pattern, '/') : '/';
        $httpMethod = strtolower($httpMethod);
        if ($callable) {
            $apiInstance = new ApiMethod($httpMethod, $pattern, $this);
            $apiMethod = $this->apiMethods->keyNested($httpMethod . '.' . $pattern, $apiInstance, true);
            $apiMethod->addCallback($callable, $this->processingEvent);
        } else {
            $apiMethod = $this->apiMethods->keyNested($httpMethod . '.' . $pattern);
        }

        return $apiMethod;
    }
}