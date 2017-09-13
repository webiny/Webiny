<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\Entity\Attributes;

use Apps\Webiny\Php\Entities\File;
use Webiny\Component\Entity\Attribute\Many2OneAttribute;
use Webiny\Component\Storage\Storage;

/**
 * File attribute
 * @package Apps\Webiny\Php\Lib\Entity\Attributes
 */
class FileAttribute extends Many2OneAttribute
{
    protected $storage = null;
    protected $storageFolder = '/';
    protected $tags = [];

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        parent::__construct();
        $this->setEntity(File::class)->onSetNull('delete')->setUpdateExisting();
    }

    /**
     * Set tags that will always be assigned to the file
     *
     * @param $tags
     *
     * @return $this
     */
    public function setTags(...$tags)
    {
        $this->tags = $tags;

        return $this;
    }

    /**
     * Set storage to use with this attribute
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
     * Set folder in which the file will be stored (relative to the root of your storage)
     *
     * @param string $folder
     *
     * @return $this
     */
    public function setFolder($folder)
    {
        $this->storageFolder = $folder;

        return $this;
    }

    public function getValue($params = [], $processCallbacks = true)
    {
        $value = parent::getValue($params);
        if ($this->isInstanceOf($value, $this->getEntity())) {
            $value->tags->merge($this->tags)->unique();
            if ($this->storage) {
                $value->setStorage($this->storage)->setStorageFolder($this->storageFolder);
            }
        }

        return $processCallbacks ? $this->processGetValue($value, $params) : $value;
    }

    public function setValue($value = null, $fromDb = false)
    {
        $currentValue = $this->getValue();
        parent::setValue($value, $fromDb);

        // If new files is being assigned and there is an existing file - delete the existing file
        if (!$fromDb && $currentValue && $currentValue->id != $this->getValue()->id) {
            $currentValue->delete();
        }

        return $this;
    }
}