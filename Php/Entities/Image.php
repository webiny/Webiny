<?php
namespace Apps\Core\Php\Entities;

use Webiny\Component\Image\ImageTrait;
use Webiny\Component\Storage\Directory\Directory;
use Webiny\Component\Storage\File\File as StorageFile;

/**
 * Class Image
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
        $this->getAttribute('src')->onGet(function ($value, $width = null, $height = null) {
            if (!$width && !$height) {
                return $value;
            }

            if ($width && !$height) {
                return $this->getSize($width);
            }

            return $this->getSize($width . 'x' . $height);
        });
    }

    public function getUrl($ext = null)
    {
        if (!$ext) {
            return $this->storage->getURL($this->src);
        }

        return $this->getSize($ext);
    }

    /**
     * @inheritDoc
     */
    public function delete()
    {
        $deleted = parent::delete();
        if ($deleted) {
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

    private function getSize($imageExt)
    {
        // Predefined sizes
        $path = explode('/', $this->src);
        $fileName = array_pop($path);
        $path = join('/', $path);

        // Build extension key
        $lastDot = strrpos($fileName, '.');
        $name = substr($fileName, 0, $lastDot);
        $ext = substr($fileName, $lastDot);
        $extPath = $name . '-size-' . $imageExt . $ext;

        // Check if file exists
        $extFile = new StorageFile($path . '/' . $extPath, $this->storage);
        if ($extFile->exists()) {
            return $extFile->getUrl();
        }

        // Create new image size
        $currentFile = new StorageFile($this->src, $this->storage);
        $image = $this->image($currentFile);

        $sizes = $this->dimensions[$imageExt] ?? explode('x', $imageExt);
        $width = $sizes[0] ?? null;
        $height = $sizes[1] ?? null;

        if (!$width || !$height) {
            return $this->getUrl();
        }

        if ($width && $height) {
            $image->resize($width, $height);
        }

        $image->save($extFile);

        return $extFile->getUrl();
    }

    /**
     * @return Directory
     * @throws \Exception
     * @throws \Webiny\Component\ServiceManager\ServiceManagerException
     * @throws \Webiny\Component\StdLib\StdObject\StringObject\StringObjectException
     */
    private function getSizes()
    {
        $path = explode('/', $this->src);
        $fileName = array_pop($path);
        $path = join('/', $path);
        $pattern = $this->str($fileName)->explode('.')->first() . '-size-*';

        return new Directory($path, $this->storage, false, $pattern);
    }
}