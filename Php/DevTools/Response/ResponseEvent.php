<?php
namespace Apps\Core\Php\DevTools\Response;

use Webiny\Component\EventManager\Event;


/**
 * Class ResponseEvent
 */
class ResponseEvent extends Event
{
    /**
     * @var ResponseAbstract
     */
    private $response;

    public function __construct(ResponseAbstract $response)
    {
        parent::__construct();
        $this->response = $response;
    }

    public function getResponse()
    {
        return $this->response;
    }
}