<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\Entity\Attributes;

use Apps\Webiny\Php\Entities\File;
use Webiny\Component\Entity\Attribute\One2ManyAttribute;
use Webiny\Component\Storage\Storage;

/**
 * File attribute
 */
class FilesAttribute extends One2ManyAttribute
{
    protected $storage = null;
    protected $storageFolder = '/';
    protected $tags = [];

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        parent::__construct(null, null, 'ref');
        $this->setEntity(File::class)->setSorter('order');
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
     * Set folder in which the files will be stored (relative to the root of your storage)
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
        $values = parent::getValue($params, false);

        foreach ($values as $value) {
            $value->tags->merge($this->tags)->unique();
            if ($this->storage) {
                $value->setStorage($this->storage)->setStorageFolder($this->storageFolder);
            }
        }

        return $processCallbacks ? $this->processGetValue($values, $params) : $values;
    }
}