<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\Dispatchers;

use Apps\Core\Php\RequestHandlers\ApiException;

trait ParamsInjectorTrait
{
    private $skipParams = [
        'XDEBUG_SESSION_START'
    ];

    protected function injectParams($class, $method, array $params)
    {
        if(is_string($method)){
            $rc = new \ReflectionClass($class);
            $rm = $rc->getMethod($method);
        } else {
            $rm = new \ReflectionFunction($method);
        }

        $methodParams = [];
        /* @var $p \ReflectionParameter */
        foreach ($rm->getParameters() as $p) {
            $pClass = $p->getClass();
            $methodParams[$p->getName()] = [
                'name'     => $p->getName(),
                'class'    => $pClass ? $pClass->getName() : null,
                'required' => !$p->allowsNull()
            ];
        }

        $methodRequiredParams = $rm->getNumberOfRequiredParameters();

        if (count($params) < $methodRequiredParams) {
            $missingParams = array_slice(array_keys($methodParams), count($params));
            throw new ApiException('Missing required params', 'WBY-ENTITY_DISPATCHER-PARAMS-1', 400, $missingParams);
        }

        $index = 0;
        foreach ($methodParams as $mp) {
            if ($mp['class']) {
                $requestedValue = $params[$index];
                $paramValue = call_user_func_array([$mp['class'], 'findById'], [$requestedValue]);
                if ($mp['required'] && $paramValue === null) {
                    $data = [];
                    $data[$mp['name']] = $mp['class'] . ' with ID `' . $requestedValue . '` was not found!';
                    throw new ApiException('Invalid parameters', 'WBY-ENTITY_DISPATCHER-PARAMS-2', 400, $data);
                }
                $params[$index] = $paramValue;
            }

            $index++;
        }

        return $params;
    }
}