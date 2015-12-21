<?php
namespace Webiny\Core\Entity;

/**
 * Exception class for the Entity component.
 *
 * @package         Webiny\Component\Entity
 */
class EntityException extends \Webiny\Component\Entity\EntityException
{

    const NOT_FOUND = 101;
    const CANNOT_DELETE = 102;

    protected static $messages = [
        101 => "Entity not found.",
        102 => "Cannot delete - %s"
    ];

}