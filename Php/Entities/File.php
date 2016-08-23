<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Webiny\Component\Image\ImageTrait;
use Webiny\Component\Mongo\Index\SingleIndex;
use Webiny\Component\Storage\Directory\Directory;
use Webiny\Component\Storage\File\File as StorageFile;
use Webiny\Component\Storage\StorageTrait;

if (!defined('DS')) {
    define('DS', DIRECTORY_SEPARATOR);
}

class File extends AbstractEntity
{
    use StorageTrait, ImageTrait;

    const STORAGE = 'Files';
    protected static $entityCollection = 'Files';
    private $dimensions = [];

    public function __construct()
    {
        parent::__construct();
        $this->index(new SingleIndex('ref', 'ref'));
        $this->getAttribute('modifiedOn')->setToArrayDefault();
        $this->attr('name')->char()->setRequired()->setToArrayDefault();
        $this->attr('title')->char()->setToArrayDefault();
        $this->attr('size')->integer()->setToArrayDefault();
        $this->attr('type')->char()->setToArrayDefault();
        $this->attr('ext')->char()->setToArrayDefault();
        $this->attr('src')->char()->setToArrayDefault()->onGet(function ($value, $width = null, $height = null) {
            if (!$width && !$height) {
                return $value;
            }

            if ($width && !$height) {
                return $this->getSize($width);
            }

            return $this->getSize($width . 'x' . $height);
        });
        $this->attr('tags')->arr()->setToArrayDefault();
        $this->attr('ref')->char()->setToArrayDefault();
        $this->attr('order')->integer()->setDefaultValue(0)->setToArrayDefault();
    }

    /**
     * @inheritDoc
     */
    public function toArray($fields = '', $nestedLevel = 1)
    {
        $data = parent::toArray($fields, $nestedLevel);
        if (isset($data['src'])) {
            $src = $this->str($data['src']);
            if (!$src->startsWith('http://') && !$src->startsWith('https://')) {
                $data['src'] = $this->getUrl();
            }
        }

        return $data;
    }

    public function getUrl($ext = null)
    {
        if (!$ext) {
            return $this->storage(self::STORAGE)->getURL($this->src);
        }

        return $this->getSize($ext);
    }

    public function getAbsolutePath()
    {
        return $this->storage(self::STORAGE)->getAbsolutePath($this->src);
    }

    /**
     * @inheritDoc
     */
    public function populate($data)
    {
        $fromDb = isset($data['__webiny_db__']);
        if ($fromDb) {
            return parent::populate($data);
        }

        $content = $this->str(isset($data['src']) ? $data['src'] : '');
        $newContent = $content->startsWith('data:');
        $newName = $data['name'] ?? $this->name;
        if ($this->exists()) {
            if ($newContent) {
                // Delete current file
                if ($newName != $this->name) {
                    $this->storage(self::STORAGE)->deleteKey($this->src);
                }
            } else {
                // These keys should not change if file content is not changing
                unset($data['src']);
                unset($data['name']);
            }
        }

        return parent::populate($data);
    }

    /**
     * @inheritDoc
     */
    public function save()
    {
        $storage = $this->storage(self::STORAGE);
        $content = $this->str($this->src);
        $newContent = $content->startsWith('data:');
        if ($newContent) {
            // Make sure file names do not clash
            if (!$this->exists()) {
                $name = $this->name;
                while ($storage->keyExists($this->getKey($name))) {
                    $name = $this->generateNewName();
                    continue;
                }
                $this->name = $name;
            }

            $key = str_replace(' ', '-', $this->name);
            $storage->setContents($key, $content->explode(',')->last()->base64Decode()->val());
            $this->src = $storage->getRecentKey();
            $this->size = $storage->getSize($this->src);
            $this->ext = $this->str(basename($this->src))->explode('.')->last()->val();
        }

        return parent::save();
    }

    /**
     * @inheritDoc
     */
    public function delete()
    {
        $deleted = parent::delete();
        if ($deleted) {
            $this->storage(self::STORAGE)->deleteKey($this->src);

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
     * Get file contents
     *
     * @return bool|string
     *
     * @throws \Exception
     * @throws \Webiny\Component\ServiceManager\ServiceManagerException
     */
    public function getContents()
    {
        return $this->storage(self::STORAGE)->getContents($this->src);
    }

    private function generateNewName()
    {
        $ext = '';
        $name = $this->str($this->name)->explode('.')->removeLast($ext)->join('.');

        return $name . '-' . time() . '.' . $ext;
    }

    private function getKey($name)
    {
        if ($this->storage(self::STORAGE)->getDriver()->createDateFolderStructure()) {
            $name = date('Y' . DS . 'm' . DS . 'd') . DS . $name;
        }

        return $name;
    }

    private function getSize($imageExt)
    {
        $storage = $this->storage(self::STORAGE);
        // Predefined sizes
        $width = $height = 0;
        $path = explode('/', $this->src);
        $fileName = array_pop($path);
        $path = join('/', $path);

        // Build extension key
        $lastDot = strrpos($fileName, '.');
        $name = substr($fileName, 0, $lastDot);
        $ext = substr($fileName, $lastDot);
        $extPath = $name . '-size-' . $imageExt . $ext;

        // Check if file exists
        $extFile = new StorageFile($path . '/' . $extPath, $storage);
        if ($extFile->exists()) {
            return $extFile->getUrl();
        }

        // Create new image size
        $currentFile = new StorageFile($this->src, $storage);
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

        return new Directory($path, $this->storage(self::STORAGE), false, $pattern);
    }
}