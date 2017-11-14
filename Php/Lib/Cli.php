<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib;

use Webiny\Component\Config\ConfigObject;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;


/**
 * Class that provides the access to webiny-cli
 */
class Cli
{
    use SingletonTrait, WebinyTrait, StdLibTrait;

    /**
     * @var ConfigObject
     */
    private $config;

    protected function init()
    {
        // Check if webiny-cli is running
        $cliConfig = $this->wStorage('Root')->getContents('webiny.json');
        $this->config = new ConfigObject(json_decode($cliConfig, true));
    }

    public function getConfig()
    {
        return $this->config;
    }

    public function isListening()
    {
        return boolval($this->get('/status'));
    }

    public function isDeveloping()
    {
        $res = $this->get('/status');

        if (!$res) {
            return false;
        }

        return in_array('develop', $res['task']);
    }

    /**
     * Get URL to webiny-cli
     *
     * @param string $path
     *
     * @return mixed
     */
    public function getUrl($path = '/')
    {
        $port = $this->config->get('cli.port', 3000);

        return $this->url('http://localhost')->setPort(intval($port))->setPath($path)->val();
    }

    private function get($path = '/', $data = null)
    {
        $curl = new \Curl\Curl();
        $curl->setJsonDecoder(function ($data) {
            return json_decode($data, true);
        });

        return $curl->get($this->getUrl($path), $data);
    }
}