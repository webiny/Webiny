<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\DevTools\Services;

use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\Dispatchers\ApiExpositionTrait;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class that contains traits needed for service development
 */
abstract class AbstractService
{
    use WebinyTrait, ApiExpositionTrait, StdLibTrait;

    function __construct()
    {
        // Does nothing yet, but is here for possible future upgrades
    }


    public static function meta()
    {
        $service = new static();

        $data = [
            'class' => get_class($service)
        ];

        foreach ($service->getApiMethods() as $httpMethod => $methods) {
            /* @var $method \Apps\Webiny\Php\Dispatchers\ApiMethod */
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
}