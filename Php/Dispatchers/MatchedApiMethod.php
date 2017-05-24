<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Dispatchers;

/**
 * Class MatchedApiMethod
 *
 * This class is used when ApiMethod is matched and URL parameters are extracted
 *
 * @package Apps\Webiny\Php\Dispatchers
 */
class MatchedApiMethod
{
    /**
     * @var ApiMethod
     */
    private $apiMethod;
    private $params;

    function __construct(ApiMethod $apiMethod, $params)
    {
        $this->apiMethod = $apiMethod;
        $this->params = $params;
    }

    public function getApiMethod()
    {
        return $this->apiMethod;
    }

    public function getParams()
    {
        return $this->params;
    }
}
