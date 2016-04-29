<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools\Entity\Attributes;

use Webiny\Component\Entity\Attribute\Many2OneAttribute;

/**
 * File attribute
 * @package Apps\Core\Php\DevTools\Entity\Attributes
 */
class FileAttribute extends Many2OneAttribute
{
    private $tags = [];

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        parent::__construct();
        $this->setEntity('\Apps\Core\Php\Entities\File')->onSetNull('delete')->setUpdateExisting();
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

    public function getValue()
    {
        $value = parent::getValue();
        if ($this->isInstanceOf($value, $this->getEntity())) {
            $value->tags->merge($this->tags)->unique();
        }

        return $value;
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