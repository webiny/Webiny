<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Dispatchers;

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
     * @param $httpMethod
     * @param $url
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
            $route = new Route($pattern, null, $method->getRouteOptions());
            $compiled = $route->compile();
            $regex = $compiled->getRegex();

            $regex = str_replace('[\w-]', '[\w-\.]', $regex);

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
     * Expose API method
     *
     * @param string   $httpMethod
     * @param string   $pattern
     * @param callable $callable
     *
     * @return ApiMethod
     */
    public function api($httpMethod, $pattern, $callable)
    {
        if (!$this->apiMethods) {
            $this->apiMethods = new ArrayObject();
        }

        $pattern = $pattern != '/' ? trim($pattern, '/') : '/';
        $httpMethod = strtolower($httpMethod);
        $apiMethod = $this->apiMethods->keyNested($httpMethod . '.' . $pattern, new ApiMethod($httpMethod, $pattern), true);
        $apiMethod->addCallback($callable);

        return $apiMethod;
    }
}