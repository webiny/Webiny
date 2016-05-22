<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools\Services;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\Dispatchers\ApiExpositionTrait;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class that contains traits needed for service development
 */
abstract class AbstractService
{
    use DevToolsTrait, ApiExpositionTrait, StdLibTrait;
}