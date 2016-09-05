<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Webiny\Component\Mongo\Index\SingleIndex;
use Webiny\Component\Storage\Storage;
use Webiny\Component\Storage\StorageTrait;

if (!defined('DS')) {
    define('DS', DIRECTORY_SEPARATOR);
}

/**
 * Class File
 *
 * @property string $name File name (the original file name)
 * @property string $title File title (optional)
 * @property int    $size Size in bytes
 * @property string $type File mime type
 * @property string $ext Extension name, eg: jpg, png, pdf, etc.
 * @property string $src Base64 encoded data string (when being created) or storage key after file is saved
 * @property array  $tags Tags assigned to file
 * @property string $ref Reference to entity
 * @property int    $order Order of file (used in image galleries)
 *
 * @package Apps\Core\Php\Entities
 */
class File extends AbstractEntity
{
    use StorageTrait;

    const DEFAULT_STORAGE = 'Files';
    protected static $entityCollection = 'Files';
    /**
     * @var Storage
     */
    protected $storage = null;

    public function __construct()
    {
        parent::__construct();
        $this->storage = $this->wStorage(self::DEFAULT_STORAGE);
        $this->index(new SingleIndex('ref', 'ref'));
        $this->getAttribute('modifiedOn')->setToArrayDefault();
        $this->attr('name')->char()->setRequired()->setToArrayDefault();
        $this->attr('title')->char()->setToArrayDefault();
        $this->attr('size')->integer()->setToArrayDefault();
        $this->attr('type')->char()->setToArrayDefault();
        $this->attr('ext')->char()->setToArrayDefault();
        $this->attr('src')->char()->setToArrayDefault();
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
        if (isset($data['src']) && is_String($data['src'])) {
            $src = $this->str($data['src']);
            if (!$src->containsAny(['http://', 'https://'])) {
                $data['src'] = $this->getUrl();
            }
        }

        return $data;
    }

    public function getUrl()
    {
        return $this->storage->getURL($this->src);
    }

    public function getAbsolutePath()
    {
        return $this->storage->getAbsolutePath($this->src);
    }

    /**
     * @inheritDoc
     */
    public function populate($data)
    {
        if (isset($data['__webiny_db__'])) {
            return parent::populate($data);
        }

        $content = $this->str(isset($data['src']) ? $data['src'] : '');
        $newContent = $content->startsWith('data:');
        $newName = $data['name'] ?? $this->name;
        if ($this->exists()) {
            if ($newContent) {
                // Delete current file
                if ($newName != $this->name) {
                    $this->storage->deleteKey($this->src);
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
        $storage = $this->storage;
        $content = $this->str($this->src);
        $newContent = $content->startsWith('data:');
        if ($newContent) {
            // Make sure file names do not clash
            if (!$this->exists()) {
                $name = $this->name;
                while ($storage->keyExists($this->createKey($name))) {
                    $name = $this->generateNewName();
                    continue;
                }
                $this->name = $name;
            }

            $key = str_replace(' ', '-', $this->name);
            $storage->setContents($key, $content->explode(',')->last()->base64Decode()->val());
            $this->src = $storage->getRecentKey();
            if($storage->supportsSize()){
                $this->size = $storage->getSize($this->src);
            }
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
            $this->storage->deleteKey($this->src);
        }

        return $deleted;
    }

    /**
     * Set File storage
     *
     * @param Storage $storage
     *
     * @return $this
     */
    public function setStorage(Storage $storage)
    {
        $this->storage = $storage;

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
        return $this->storage->getContents($this->src);
    }

    /**
     * Generate new file name
     *
     * @return string
     * @throws \Webiny\Component\StdLib\StdObject\StringObject\StringObjectException
     */
    protected function generateNewName()
    {
        $ext = '';
        $name = $this->str($this->name)->explode('.')->removeLast($ext)->join('.');

        return $name . '-' . time() . '.' . $ext;
    }

    /**
     * Create file storage key
     *
     * @param $name
     *
     * @return string
     */
    protected function createKey($name)
    {
        if ($this->storage->getDriver()->createDateFolderStructure()) {
            $name = date('Y' . DS . 'm' . DS . 'd') . DS . $name;
        }

        return $name;
    }
}