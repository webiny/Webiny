<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Dispatchers;

use Apps\Core\Php\RequestHandlers\ApiException;

trait ParamsInjectorTrait
{
    private $skipParams = [
        'XDEBUG_SESSION_START'
    ];

    protected function injectParams($function, array $params)
    {
        $rm = new \ReflectionFunction($function);

        $methodParams = [];
        $methodRequiredParams = 0;
        /* @var $p \ReflectionParameter */
        foreach ($rm->getParameters() as $p) {
            if ($p->getName() == 'parent') {
                continue;
            }
            $pClass = $p->getClass();
            $methodParams[$p->getName()] = [
                'name'     => $p->getName(),
                'class'    => $pClass ? $pClass->getName() : null,
                'required' => !$p->allowsNull()
            ];

            if (!$p->allowsNull()) {
                $methodRequiredParams++;
            }
        }

        if (count($params) < $methodRequiredParams) {
            $missingParams = array_slice(array_keys($methodParams), count($params));
            throw new ApiException('Missing required params', 'WBY-PARAMS_INJECTOR-1', 400, $missingParams);
        }

        $index = 0;
        $injectedParams = [];
        foreach ($methodParams as $pName => $mp) {
            if ($mp['class']) {
                $requestedValue = $params[$pName];
                $paramValue = call_user_func_array([$mp['class'], 'findById'], [$requestedValue]);
                if ($mp['required'] && $paramValue === null) {
                    $data = [];
                    $data[$mp['name']] = $mp['class'] . ' with ID `' . $requestedValue . '` was not found!';
                    throw new ApiException('Invalid parameters', 'WBY-PARAMS_INJECTOR-2', 400, $data);
                }
                $injectedParams[] = $paramValue;
            } else {
                $injectedParams[] = $params[$pName];
            }

            $index++;
        }

        return $injectedParams;
    }
}