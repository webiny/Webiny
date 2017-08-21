<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\DevTools\Api;

use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;
use Webiny\Component\Router\Route\Route;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class ApiContainer
 *
 * This class is a container of all entity API methods that is reused among entity instances
 *
 * @package Apps\Webiny\Php\DevTools\Api
 */
class ApiContainer
{
    use StdLibTrait;

    /**
     * @var \Closure
     */
    public $initializers = [];
    public $instance;
    private $apiMethods = [];
    private $initialized = false;
    private $processingEvent = false;

    public function __construct($instance)
    {
        $this->instance = $instance;
    }

    public function addInitializer(\Closure $initializer)
    {
        $this->initializers[] = $initializer;
    }

    public function get($pattern, $function)
    {
        return $this->api('get', $pattern, $function);
    }

    public function post($pattern, $function)
    {
        return $this->api('post', $pattern, $function);
    }

    public function patch($pattern, $function)
    {
        return $this->api('patch', $pattern, $function);
    }

    public function delete($pattern, $function)
    {
        return $this->api('delete', $pattern, $function);
    }

    /**
     * @return array
     */
    public function getMethods()
    {
        return $this->apiMethods;
    }

    public function getMethod($httpMethod, $url)
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

    public function isInitialized()
    {
        return $this->initialized;
    }

    public function initialize()
    {
        $this->initialized = true;
        foreach ($this->initializers as $initializer) {
            call_user_func_array($initializer, [$this]);
        }

        if ($this->instance instanceof AbstractEntity) {
            $this->processingEvent = true;
            $this->instance->trigger('onExtendApi', $this);
            $this->processingEvent = false;
        }
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
