<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Dispatchers;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Response\ApiErrorResponse;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

abstract class AbstractApiDispatcher
{
    use DevToolsTrait, StdLibTrait;

    protected function parseUrl(StringObject $url)
    {
        $parts = $url->trim('/')->explode('/', 3);

        if ($parts->count() < 2) {
            return new ApiErrorResponse([], 'Not enough parameters to dispatch API request!');
        }

        $data = [
            'app'    => $this->toPascalCase($parts[0]),
            'class'  => $this->toPascalCase($parts[1]),
            'params' => $this->str($parts->key(2, '', true))->explode('/')->filter()->val()
        ];

        return $data;
    }

    protected function fileExists($class)
    {
        $parts = $this->str($class)->explode('\\')->filter()->values()->val();
        $version = $this->wConfig()->get('Apps.' . $parts[1]);
        if ($version && $version !== 'root') {
            array_splice($parts, 2, 0, str_replace('.', '_', $version));
        }

        return file_exists($this->wConfig()->get('Application.AbsolutePath') . join('/', $parts) . '.php');
    }

    protected function toCamelCase($str)
    {
        return $this->str($this->toPascalCase($str))->caseFirstLower()->val();
    }

    protected function toPascalCase($str)
    {
        return $this->str($str)->replace('-', ' ')->caseWordUpper()->replace(' ', '')->val();
    }
}