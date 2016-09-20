<?php
namespace Apps\Core\Php\Entities;

use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\Image\ImageTrait;
use Webiny\Component\Storage\File\File as StorageFile;

/**
 * Class Image
 *
 * @property string $imageSize
 *
 * @package Apps\Core\Php\Entities
 */
class Image extends File
{
    use ImageTrait;

    protected $dimensions = [];

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
    }

    public function toArray($fields = '', $nestedLevel = 1)
    {
        $data = parent::toArray($fields, $nestedLevel);
        if (is_array($data['src'])) {
            foreach ($data['src'] as $dimension => $key) {
                $src = $this->str($key);
                if (!$src->containsAny(['http://', 'https://'])) {
                    $data['src'][$dimension] = $this->storage->getURL($key);
                }
            }
        }

        return $data;
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

    private function getSize($size)
    {
        if ($size === 'original') {
            return $this->getUrl();
        }

        /* @var $sizeFile Image */
        $sizeFile = static::findOne(['ref' => $this->id, 'imageSize' => $size]);
        if ($sizeFile) {
            return $sizeFile->setStorage($this->storage)->getUrl();
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

        $sizes = $this->dimensions[$size] ?? explode('x', $size);
        $width = $sizes[0] ?? null;
        $height = $sizes[1] ?? null;

        if (!$width || !$height) {
            return $this->getUrl();
        }

        if ($width && $height) {
            $image->resize($width, $height);
        }

        $image->save($extFile);

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