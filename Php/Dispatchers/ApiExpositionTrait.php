<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Dispatchers;

use Apps\Core\Php\RequestHandlers\ApiException;
use Webiny\Component\Router\Route\Route;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Trait ApiExpositionTrait
 *
 * This class is used when we want to expose entity or service methods to the API
 *
 * @package Apps\Core\Php\Dispatchers
 */
trait ApiExpositionTrait
{
    /**
     * @var ArrayObject
     */
    private $apiMethods;

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
        $methods = $this->apiMethods->key($httpMethod);

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
            $apiMethod = $this->apiMethods->keyNested($httpMethod . '.' . $pattern, new ApiMethod($httpMethod, $pattern, $this), true);
            $apiMethod->addCallback($callable);
        } else {
            $apiMethod = $this->apiMethods->keyNested($httpMethod . '.' . $pattern);
        }

        return $apiMethod;
    }
}