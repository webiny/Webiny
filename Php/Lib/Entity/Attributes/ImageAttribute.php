<?php

namespace Apps\Webiny\Php\Lib\Entity\Attributes;

use Apps\Webiny\Php\Entities\Image;

/**
 * File ImageAttribute
 */
class ImageAttribute extends FileAttribute
{
    protected $dimensions = [];
    protected $quality = 90;

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        parent::__construct();
        $this->setEntity(Image::class);
    }

    /**
     * Set image dimensions
     *
     * @param array $dimensions
     *
     * @return $this
     */
    public function setDimensions(array $dimensions)
    {
        $this->dimensions = $dimensions;

        return $this;
    }

    /**
     * Set image quality
     *
     * @param int $quality
     *
     * @return $this
     */
    public function setQuality($quality)
    {
        $this->quality = $quality;

        return $this;
    }

    /**
     * @inheritdoc
     */
    public function getValue($params = [], $processCallbacks = true)
    {
        /* @var Image $value */
        $value = parent::getValue($params, false);
        if ($value) {
            $value->setDimensions($this->dimensions);
            $value->setQuality($this->quality);
        }

        return $processCallbacks ? $this->processGetValue($value, $params) : $value;
    }
}