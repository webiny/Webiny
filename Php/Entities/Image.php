<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\Image\Bridge\ImageException;
use Webiny\Component\Image\ImageLoader;
use Webiny\Component\Image\ImageTrait;
use Webiny\Component\Storage\File\File as StorageFile;

/**
 * Class Image
 *
 * @property string  $imageSize
 * @property integer $width
 * @property integer $height
 * @property float   $aspectRatio
 * @property bool    $isPortrait
 * @property bool    $isLandscape
 */
class Image extends File
{
    use ImageTrait;

    protected static $classId = 'Webiny.Entities.Image';
    protected static $i18nNamespace = 'Webiny.Entities.Image';
    protected $dimensions = [];
    protected $quality = 90;

    public function __construct()
    {
        parent::__construct();
        $this->attr('imageSize')->char()->setDefaultValue('original');

        $this->getAttribute('src')->onGet(function ($value, ...$dimensions) {
            if (!$dimensions) {
                return $value;
            }

            if (count($dimensions) === 1) {
                return $this->getSize($dimensions[0]);
            }

            $urls = [];
            foreach ($dimensions as $d) {
                $urls[$d] = $this->getSize($d);
            }

            return $urls;
        });

        $this->attr('width')->integer()->setSkipOnPopulate();
        $this->attr('height')->integer()->setSkipOnPopulate();

        $this->attr('aspectRatio')->dynamic(function () {
            if ($this->height) {
                return $this->width / $this->height;
            }

            return 0;
        });

        $this->attr('isPortrait')->dynamic(function () {
            return $this->aspectRatio <= 1;
        });

        $this->attr('isLandscape')->dynamic(function () {
            return $this->aspectRatio > 1;
        });
    }

    public function toArray($fields = '', $nestedLevel = 1)
    {
        $data = parent::toArray($fields, $nestedLevel);
        if (is_array($data['src'])) {
            foreach ($data['src'] as $dimension => $key) {
                $src = $this->str($key);
                if (!$src->containsAny(['http://', 'https://']) && !$src->startsWith('//')) {
                    $data['src'][$dimension] = $this->storage->getURL($key);
                }
            }
        }

        return $data;
    }

    /**
     * Save image
     *
     * @param bool $compress Whether to attempt compression on given image or not
     *
     * @return bool
     * @throws \Webiny\Component\StdLib\StdObject\StringObject\StringObjectException
     */
    public function save($compress = true)
    {
        $content = $this->str($this->src);
        $newContent = $content->startsWith('data:');

        if ($newContent && $this->type !== 'image/svg+xml') {
            $parts = $content->explode(',');
            /* @var $image \Webiny\Component\Image\ImageInterface */
            $image = ImageLoader::load($parts->last()->base64Decode()->val());
            $dimensions = $image->getSize();
            $this->width = $dimensions['width'];
            $this->height = $dimensions['height'];

            if ($compress) {
                // Format is one of these strings: jpg, jpeg, png, gif
                // We read it from `type` attribute which is populated by HTML5 API when selecting images for upload
                try {
                    $image->setFormat($this->str($this->type)->explode('/')->last()->val());
                } catch (ImageException $e) {
                    // Ignore format error - continue as is
                }

                if ($this->type === 'image/gif') {
                    $this->src = $parts->first() . ',' . $parts->last()->val();
                } else {
                    $this->src = $parts->first() . ',' . base64_encode($image->getBinary(['quality' => $this->quality]));
                }
            }
        }

        return parent::save();
    }

    public function getUrl($size = null)
    {
        if (!$size) {
            return $this->storage->getURL($this->src);
        }

        return $this->getSize($size);
    }

    /**
     * @inheritDoc
     */
    public function delete($permanent = false)
    {
        $deleted = parent::delete($permanent);
        if ($deleted && $permanent) {
            /* @var $file StorageFile */
            foreach ($this->getSizes() as $file) {
                $file->delete();
            }
        }

        return $deleted;
    }

    /**
     * Set file dimensions
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

    public function getSize($size)
    {
        if ($size === 'original') {
            return $this->getUrl();
        }

        if ($this->storage->supportsAbsolutePaths() && !$this->storage->keyExists($this->src) && !$this->wIsProduction()) {
            return '//placehold.it/' . $size;
        }

        /* @var $sizeFile Image */
        $sizeFile = static::findOne(['ref' => $this->id, 'imageSize' => $size]);
        if ($sizeFile) {
            return $sizeFile->setStorage($this->storage)->getUrl();
        }

        $sizes = $this->dimensions[$size] ?? explode('x', $size);
        $width = $sizes[0] ?? null;
        $height = $sizes[1] ?? null;

        if (!is_numeric($width)) {
            throw new AppException('Invalid image dimensions (' . $size . ')');
        }

        // Build size key
        $path = explode('/', $this->src);
        $fileName = array_pop($path);
        $path = join('/', $path);
        $lastDot = strrpos($fileName, '.');
        $name = substr($fileName, 0, $lastDot);
        $ext = substr($fileName, $lastDot);
        $sizeKey = $name . '-' . $size . $ext;

        // Image size file object
        $extFile = new StorageFile($path . '/' . $sizeKey, $this->storage);

        // Create new image size
        $currentFile = new StorageFile($this->src, $this->storage);
        $image = $this->image($currentFile);

        // If height was not defined, that means only width was given and height has to calculated automatically (aspect ratio kept)
        if (!$height) {
            $dimensions = $image->getSize();
            $aspectRatio = round($dimensions['width'] / $dimensions['height'], 3);
            $height = $width / $aspectRatio;
        }

        $image->resize($width, $height)->save($extFile);

        // Create new record in DB
        $newSize = new static;
        $newSize->src = $this->storage->getRecentKey();
        $newSize->tags = ['size', $size];
        $newSize->ref = $this->id;
        $newSize->name = $this->name;
        $newSize->size = $extFile->getSize();
        $newSize->type = $this->type;
        $newSize->ext = $this->ext;
        $newSize->imageSize = $size;
        $newSize->width = (int)$width;
        $newSize->height = (int)$height;
        $newSize->save();

        return $extFile->getUrl();
    }

    protected function deleteFileFromStorage()
    {
        if (!$this->tags->inArray('size')) {
            /* @var $image Image */
            foreach ($this->getSizes() as $image) {
                $image->delete();
            }
        }

        return parent::deleteFileFromStorage();
    }


    /**
     * Get existing sizes of this file
     *
     * @return EntityCollection
     */
    private function getSizes()
    {
        return array_map(function (Image $image) {
            return $image->setStorage($this->storage);
        }, static::find(['tags' => 'size', 'ref' => $this->id])->getData());
    }
}