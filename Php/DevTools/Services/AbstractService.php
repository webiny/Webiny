<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\DevTools\Services;

use Apps\Webiny\Php\DevTools\Api\ApiContainer;
use Apps\Webiny\Php\DevTools\Api\ApiExpositionTrait;
use Apps\Webiny\Php\DevTools\Api\ApiMethod;
use Apps\Webiny\Php\DevTools\WebinyTrait;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class that contains traits needed for service development
 */
abstract class AbstractService
{
    use WebinyTrait, ApiExpositionTrait, StdLibTrait;

    protected static $classCallbacks = [];

    abstract protected function serviceApi(ApiContainer $api);

    public function __construct()
    {
        // Does nothing yet, but is here for possible future upgrades
    }

    public static function meta()
    {
        $service = new static();

        $data = [
            'class' => get_class($service)
        ];

        foreach ($service->getApi()->getMethods() as $httpMethod => $methods) {
            /* @var $method ApiMethod */
            foreach ($methods as $pattern => $method) {
                $data['methods'][] = [
                    'key'        => $pattern . '.' . $httpMethod,
                    'httpMethod' => $httpMethod,
                    'pattern'    => $pattern,
                    'url'        => $method->getUrl()
                ];
            }
        }

        return $data;
    }

    public static function onExtendApi($callback)
    {
        static::$classCallbacks[get_called_class()][] = $callback;
    }

    protected function initializeApi(ApiContainer $api)
    {
        $this->serviceApi($api);

        // Process onExtendApi callbacks
        $className = get_called_class();
        $classes = array_values([$className] + class_parents($className));
        foreach ($classes as $class) {
            $callbacks = static::$classCallbacks[$class] ?? [];
            foreach ($callbacks as $callback) {
                if (is_callable($callback)) {
                    $callback($api);
                }
            }
        }
    }
}