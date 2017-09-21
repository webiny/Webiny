<?php

namespace Apps\Webiny\Php\Lib\Entity\Attributes;

use Apps\Webiny\Php\Entities\Image;

/**
 * Images attribute
 */
class ImagesAttribute extends FilesAttribute
{
    protected $dimensions = [];

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        parent::__construct();
        $this->setEntity(Image::class)->setSorter('order');
    }

    public function setDimensions(array $dimensions)
    {
        $this->dimensions = $dimensions;

        return $this;
    }

    public function getValue($params = [], $processCallbacks = true)
    {
        $values = parent::getValue($params, false);

        /* @var Image $value */
        foreach ($values as $value) {
            $value->setDimensions($this->dimensions);
        }

        return $processCallbacks ? $this->processGetValue($values, $params) : $values;
    }
}