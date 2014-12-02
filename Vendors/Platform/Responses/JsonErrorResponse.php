<?php
namespace Platform\Responses;

/**
 * Class JsonErrorResponse
 * @package Platform
 */
class JsonErrorResponse extends JsonResponse
{
    protected $_data;
    protected $_error = true;
    protected $_msg;
    protected $_tag;

    public function __construct($data, $msg = '', $tag = '')
    {
        $this->_data = $data;
        $this->_msg = $msg;
        $this->_tag = $tag;
    }
}