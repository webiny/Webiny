<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\Api;

use Webiny\Component\Router\Route\Route;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class ApiContainer
 *
 * This class is a container of all entity API methods that is reused among entity instances
 *
 * @package Apps\Webiny\Php\Lib\Api
 */
class ApiContainer
{
    use StdLibTrait;

    private $context;
    private $apiMethods = [];
    private $processingEvent = false;

    public function __construct($context)
    {
        $this->context = $context;
    }

    public function setEvent($event)
    {
        $this->processingEvent = $event;
    }

    /**
     * Create a GET method
     *
     * @param string   $pattern URL pattern
     * @param \Closure $function Callback to execute when method is matched
     *
     * @return ApiMethod|null
     */
    public function get($pattern, $function)
    {
        return $this->api('get', $pattern, $function);
    }

    /**
     * Create a POST method
     *
     * @param string   $pattern URL pattern
     * @param \Closure $function Callback to execute when method is matched
     *
     * @return ApiMethod|null
     */
    public function post($pattern, $function)
    {
        return $this->api('post', $pattern, $function);
    }

    /**
     * Create a PATCH method
     *
     * @param string   $pattern URL pattern
     * @param \Closure $function Callback to execute when method is matched
     *
     * @return ApiMethod|null
     */
    public function patch($pattern, $function)
    {
        return $this->api('patch', $pattern, $function);
    }

    /**
     * Create a DELETE method
     *
     * @param string   $pattern URL pattern
     * @param \Closure $function Callback to execute when method is matched
     *
     * @return ApiMethod|null
     */
    public function delete($pattern, $function)
    {
        return $this->api('delete', $pattern, $function);
    }

    /**
     * Remove method from API container
     *
     * @param string $http HTTP method
     * @param string $pattern Pattern
     *
     * @return $this
     */
    public function removeMethod($http, $pattern)
    {
        unset($this->apiMethods[$http][$pattern]);

        return $this;
    }

    /**
     * @return array
     */
    public function getMethods()
    {
        return $this->apiMethods;
    }

    /**
     * Get ApiMethod for given http method and url pattern
     *
     * @param $httpMethod
     * @param $pattern
     *
     * @return ApiMethod|null
     */
    public function getMethod($httpMethod, $pattern)
    {
        return $this->apiMethods[$httpMethod][$pattern] ?? null;
    }

    /**
     * Get method that matches given $httpMethod and $url
     *
     * @param string $httpMethod
     * @param string $url
     *
     * @return MatchedApiMethod|null
     */
    public function matchMethod($httpMethod, $url)
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

    private function api($httpMethod, $pattern, $callable = null)
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
                $apiInstance = new ApiMethod($httpMethod, $pattern, $this->context);
            }

            $apiInstance->addCallback($callable, $this->processingEvent);
            $this->apiMethods[$httpMethod][$pattern] = $apiInstance;
        } else {
            $apiInstance = $this->apiMethods[$httpMethod][$pattern] ?? null;
        }

        return $apiInstance;
    }
}
