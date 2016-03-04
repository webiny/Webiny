<?php
namespace Apps\Core\Php\Discover\Postman;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\Discover\Parser\EntityParser;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

class EntityEndPoint
{
    use DevToolsTrait, StdLibTrait;

    /**
     * @var EntityParser
     */
    private $parser;

    /**
     * Entity API method
     * @var array
     */
    private $method;

    function __construct(EntityParser $parser, $method)
    {
        $this->parser = $parser;
        $this->method = $method;
    }

    public function getRequest()
    {
        $request = [
            'id'          => StringObject::uuid(),
            'headers'     => $this->formatHeaders(),
            'url'         => '{{apiUrl}}' . $this->method['path'],
            'method'      => $this->method['method'],
            'data'        => [],
            'name'        => $this->method['name'],
            'description' => $this->method['description'],
            'time'        => time(),
            'version'     => (string)$this->parser->getApp()->getVersion(),
            'tests'       => join("\n", $this->method['tests'])
        ];

        if (in_array($this->method['method'], ['POST', 'PATCH'])) {
            $request['dataMode'] = 'raw';
            $request['rawModeData'] = $this->formatBody();
        }

        return $request;
    }

    private function formatHeaders()
    {
        $headers = [];
        foreach ($this->method['headers'] as $p) {
            $headers[] = $p['name'] . ':{{' . $this->str($p['name'])->camelCase() . '}}';
        }

        return join("\n", $headers);
    }

    private function formatBody()
    {
        $body = [];
        foreach ($this->method['body'] as $name => $p) {
            $body[$name] = $p['value'];
        }

        return json_encode($body, JSON_PRETTY_PRINT);
    }

    private function getBody($attrs)
    {
        $body = [];
        foreach ($attrs as $name => $attr) {
            $body[$name] = $attr['value'];
        }

        return $body;
    }
}
