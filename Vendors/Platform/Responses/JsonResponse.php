<?php
namespace Platform\Responses;

/**
 * Class JsonResponse
 * @package Platform
 */
class JsonResponse extends ResponseAbstract
{
    protected $_data;
    protected $_error;
    protected $_msg;
    protected $_tag;

    public function __construct($data, $error = false, $msg = '', $tag = '')
    {
        $this->_data = $data;
        $this->_error = $error;
        $this->_msg = $msg;
        $this->_tag = $tag;
    }

    public function output()
    {
        $this->_adaptId();
        $data = [
            'error' => $this->_error,
            'message' => $this->_msg,
            'data' => $this->_data,
            'tag' => $this->_tag
        ];
        header("Content-type: application/json");
        die(json_encode($data));
    }

    private function _adaptId(){
        if(isset($this->_data['_id'])){
            $this->_data['id'] = (string) $this->_data['_id'];
            $this->_data['_id'] = (string) $this->_data['_id'];
        }
    }
}