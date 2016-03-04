<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\Dispatchers;

/**
 * Class ApiMethod
 *
 * This class is used when we want to expose class or service method to the API
 *
 * @package Apps\Core\Php\Dispatchers
 */
class ApiMethod
{
    use ParamsInjectorTrait;

    private $httpMethod;
    private $methodName;
    private $callbacks = [];
    private $bodyValidators;

    function __construct($httpMethod, $methodName, $callable = null)
    {
        $this->httpMethod = $httpMethod;
        $this->methodName = $methodName;
        if ($callable) {
            $this->callbacks = [$callable];
        }
    }

    public function __invoke($params)
    {
        if(!$params){
            $params = [];
        }
        $callback = $this->callbacks[0];
        $callbackCount = count($this->callbacks);
        $params = $this->injectParams($callback, $params);
        if ($callbackCount > 1) {
            $params[] = $this->createParent(1);
        }

        return $callback(...$params);
    }

    public function addCallback($callable)
    {
        array_unshift($this->callbacks, $callable);

        return $this;
    }

    /**
     * Set body validators
     *
     * @param array $validators
     *
     * @return $this
     */
    public function setBodyValidators(array $validators = [])
    {
        $this->bodyValidators = $validators;

        return $this;
    }

    /**
     * Add validators to existing set of validators.
     * Use this if you are overriding parent API method and calling $parent()
     *
     * @param array $validators
     *
     * @return $this
     */
    public function addBodyValidators(array $validators = [])
    {
        $this->bodyValidators = array_merge($this->bodyValidators, $validators);

        return $this;
    }

    private function createParent($index)
    {
        return function () use ($index) {
            $params = func_get_args();
            $callback = $this->callbacks[$index];
            if (count($this->callbacks) > $index + 1) {
                $params[] = $this->createParent($index + 1);
            }

            return $callback(...$params);
        };
    }
}