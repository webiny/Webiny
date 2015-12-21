<?php
namespace Webiny\Core;

use Webiny\Component\Config\Config;
use Webiny\Component\StdLib\SingletonTrait;

/**
 * Class ConfigLoader parses module config and injects variables from App config
 *
 * @package Webiny\Core
 */
class ConfigLoader
{
    use SingletonTrait;

    public function yaml($path, $flushCache = false)
    {
        $config = file_get_contents($path);
        preg_match_all('/(__[\w+\.]+__)/', $config, $matches);

        if(count($matches[0])){
            foreach($matches[0] as $item){
                $value = Platform::getInstance()->getConfig(trim($item, '_'));
                if($value != null){
                    $config = str_replace($item, $value, $config);
                }

                if($item == '__DIR__'){
                    $config = str_replace('__DIR__', dirname($path), $config);
                }
            }
            return Config::getInstance()->yaml($config, $flushCache);
        }

        return Config::getInstance()->yaml($path, $flushCache);
    }

    public function php($array, $flushCache = false)
    {
        return Config::getInstance()->php($array, $flushCache);
    }

}