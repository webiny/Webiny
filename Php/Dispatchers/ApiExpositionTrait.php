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

    public function api($httpMethod, $entityMethod, $callback = null)
    {
        if (!$this->apiMethods) {
            $this->apiMethods = new ArrayObject();
        }

        $httpMethod = strtolower($httpMethod);
        $this->apiMethods->keyNested($entityMethod . '.' . $httpMethod, ['callable' => $callback]);

        return $this;
    }
}