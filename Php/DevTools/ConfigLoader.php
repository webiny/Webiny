<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\DevTools;

use Webiny\Component\Config\Config as ConfigComponent;
use Webiny\Component\StdLib\SingletonTrait;

/**
 * Class ConfigLoader parses module config and injects variables from App config
 *
 * @package Apps\Webiny\Php\DevTools
 */
class ConfigLoader
{
    use SingletonTrait, WebinyTrait;

    public function yaml($path, $flushCache = false)
    {
        $config = file_get_contents($path);
        preg_match_all('/(__[\w+\.]+__)/', $config, $matches);

        if(count($matches[0])){
            foreach($matches[0] as $item){
                $value = $this->wConfig()->get(trim($item, '_'));
                if($value !== null){
                    $config = str_replace($item, ''.$value, $config);
                }

                if($item == '__DIR__'){
                    $config = str_replace('__DIR__', dirname($path), $config);
                }
            }
            return ConfigComponent::getInstance()->yaml($config, $flushCache);
        }

        return ConfigComponent::getInstance()->yaml($path, $flushCache);
    }

    public function php($array, $flushCache = false)
    {
        return ConfigComponent::getInstance()->php($array, $flushCache);
    }

}