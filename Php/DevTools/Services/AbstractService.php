<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools\Services;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\Dispatchers\ApiExpositionTrait;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class that contains traits needed for service development
 */
abstract class AbstractService
{
    use WebinyTrait, ApiExpositionTrait, StdLibTrait;

    public static function meta()
    {
        $service = new static();

        $data = [
            'class' => get_class($service)
        ];

        foreach ($service->getApiMethods() as $httpMethod => $methods) {
            /* @var $method \Apps\Core\Php\Dispatchers\ApiMethod */
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