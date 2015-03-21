<?php
namespace Webiny\Platform\Responses;

/**
 * Class JsonErrorResponse
 * @package Platform
 */
class JsonErrorResponse extends JsonResponse
{
    protected $_error = true;

    public function __construct($data, $msg = '', $tag = '')
    {
        $this->_data = $data;
        $this->_msg = $msg;
        $this->_tag = $tag;
    }
}