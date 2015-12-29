<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\DevTools;

use Webiny\Component\Config\ConfigObject;
use Webiny\Component\Router\Matcher\MatchedRoute;
use Webiny\Component\StdLib\SingletonTrait;

/**
 * Router class.
 *
 * This class holds all the registered routes and provides methods for matching and generating urls.
 *
 */
class Router
{
    use SingletonTrait;

    /**
     * @var \Webiny\Component\Router\Router
     */
    private $router;

    /**
     * @var ConfigObject
     */
    private $routes;


    /**
     * Basic router constructor.
     */
    protected function init()
    {
        $this->router = \Webiny\Component\Router\Router::getInstance();
        $this->router->setCache(Cache::getInstance()->getCache());

        $this->routes = new ConfigObject([]);
    }

    /**
     * Register routes.
     *
     * @param ConfigObject $routes A ConfigObject instance with list of routes and route details.
     */
    public function registerRoutes(ConfigObject $routes)
    {
        $this->routes->mergeWith($routes);
    }

    /**
     * Returns the internal object holding all the routes.
     *
     * @return ConfigObject
     */
    public function getRoutes()
    {
        return $this->routes;
    }

    /**
     * Sets the internal object that holds all the routes.
     * Do not use this function, it is used to populate the routes from the cache.
     *
     * @param ConfigObject $routes
     */
    public function setRoutes(ConfigObject $routes)
    {
        $this->routes = $routes;
    }

    /**
     * This method is called when all routes are registered.
     * It is called automatically, no need to call it again.
     */
    public function compileRoutes()
    {
        // compile routes
        $this->router->appendRoutes($this->routes);
    }

    /**
     * Checks is some of the registered routes matches the given url.
     *
     * @param string $url Url.
     *
     * @return array|bool Returns either the matched route or false.
     */
    public function match($url)
    {
        return $this->router->match($url);
    }

    /**
     * Execute a route
     *
     * @param MatchedRoute $route
     *
     * @return mixed
     * @throws \Webiny\Component\Router\RouterException
     */
    public function execute(MatchedRoute $route)
    {
        return $this->router->execute($route);
    }

    /**
     * Generate a url from a route.
     *
     * @param string $name       Name of the Route.
     * @param array  $parameters List of parameters that need to be replaced within the Route path.
     * @param bool   $absolute   Do you want to get the absolute url or relative. Default is absolute.
     *
     * @return string Generated url.
     */
    public function generate($name, $parameters = [], $absolute = true)
    {
        return $this->router->generate($name, $parameters, $absolute);
    }
}
