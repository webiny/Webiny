<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\Entity\Attributes;

/**
 * File ImageAttribute
 * @package Apps\Webiny\Php\Lib\Entity\Attributes
 */
class ImageAttribute extends FileAttribute
{
    protected $dimensions = [];

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        parent::__construct();
        $this->setEntity('\Apps\Webiny\Php\Entities\Image');
    }

    public function setDimensions(array $dimensions)
    {
        $this->dimensions = $dimensions;

        return $this;
    }

    public function getValue($params = [], $processCallbacks = true)
    {
        $value = parent::getValue($params, false);
        if ($value) {
            $value->setDimensions($this->dimensions);
        }

        return $processCallbacks ? $this->processGetValue($value, $params) : $value;
    }
}