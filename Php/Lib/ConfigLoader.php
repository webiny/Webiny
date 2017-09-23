<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib;

use Webiny\Component\Config\Config as ConfigComponent;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\StdLib\SingletonTrait;

/**
 * Class ConfigLoader parses module config and injects variables from App config
 */
class ConfigLoader
{
    use SingletonTrait, WebinyTrait;

    public function yaml($path)
    {
        $config = file_get_contents($path);
        $config = str_replace('__DIR__', dirname($path), $config);

        return ConfigComponent::getInstance()->yaml($config);
    }

    public function php($array)
    {
        return ConfigComponent::getInstance()->php($array);
    }

    public function injectVariables(ConfigObject $config)
    {
        $json = $config->getAsJson();
        preg_match_all('/(__[\w+\.]+__)/', $json, $matches);

        if (count($matches[0])) {
            foreach (array_unique($matches[0]) as $item) {
                $value = $config->get(trim($item, '_'));
                if ($value !== null) {
                    $json = str_replace($item, '' . $value, $json);
                }
            }

            $this->wConfig()->setConfig(ConfigComponent::getInstance()->json($json));
        }
    }
}