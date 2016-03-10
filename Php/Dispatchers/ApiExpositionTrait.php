<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\Dispatchers;

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
     * @param $entityMethod
     *
     * @return ApiMethod
     */
    public function getApiMethod($httpMethod, $entityMethod)
    {
        if (!$this->apiMethods) {
            $this->apiMethods = new ArrayObject();
        }

        $httpMethod = strtolower($httpMethod);

        return $this->apiMethods->keyNested($entityMethod . '.' . $httpMethod);
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
     * @param string   $entityMethod
     * @param callable $callable
     *
     * @return ApiMethod
     */
    public function api($httpMethod, $entityMethod, $callable)
    {
        if (!$this->apiMethods) {
            $this->apiMethods = new ArrayObject();
        }

        $httpMethod = strtolower($httpMethod);
        $apiMethod = $this->apiMethods->keyNested($entityMethod . '.' . $httpMethod, new ApiMethod($httpMethod, $entityMethod), true);
        $apiMethod->addCallback($callable);

        return $apiMethod;
    }
}