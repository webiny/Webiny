<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools\Entity\Attributes;

use Webiny\Component\Entity\Attribute\One2ManyAttribute;
use Webiny\Component\Entity\EntityAbstract;

/**
 * File attribute
 * @package Apps\Core\Php\DevTools\Entity\Attributes
 */
class FilesAttribute extends One2ManyAttribute
{
    private $tags = [];

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        parent::__construct(null, null, 'ref');
        $this->setEntity('\Apps\Core\Php\Entities\File')->setSorter('order');
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

    public function getValue($params = [])
    {
        $values = parent::getValue($params);

        foreach ($values as $value) {
            $value->tags->merge($this->tags)->unique();
        }

        return $values;
    }
}