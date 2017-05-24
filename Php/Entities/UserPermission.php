<?php
namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;
use Webiny\Component\Mongo\Index\SingleIndex;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class UserPermission
 *
 * @property string      $name
 * @property string      $slug
 * @property ArrayObject $permissions
 *
 * @package Apps\Webiny\Php\Entities
 *
 */
class UserPermission extends AbstractEntity
{

    protected static $entityCollection = 'UserPermissions';
    protected static $entityMask = '{name}';

    public function __construct()
    {
        parent::__construct();

        $this->index(new SingleIndex('slug', 'slug', false, true));
        $this->attr('name')->char()->setValidators('required')->setToArrayDefault()->onSet(function ($name) {
            if (!$this->slug && !$this->exists()) {
                $this->slug = $this->str($name)->slug()->val();
            }

            return $name;
        });

        $this->attr('slug')->char()->setValidators('required,unique')->onSet(function ($slug) {
            if (!$slug) {
                return $this->slug;
            }

            return $this->str($slug)->slug()->val();
        })->setToArrayDefault();

        $this->attr('description')->char()->setToArrayDefault();
        $this->attr('roles')->many2many('UserRole2UserPermission')->setEntity('\Apps\Webiny\Php\Entities\UserRole');
        $this->attr('permissions')->object();

        /**
         * @api.name                Toggle crud operation availability
         * @api.description         Toggles basic crud operation availability on given entity in loaded permission
         * @api.body.entity         Entity class
         * @api.body.crudOperation  Crud operation that needs to be toggled (can be crudCreate, crudRead, crudUpdate, crudDelete)
         */
        $this->api('PATCH', '/{id}/entity/toggle', function () {
            $data = $this->wRequest()->getRequestData();
            $key = 'entities.' . $data['entity'] . '.' . $data['crudOperation'];
            $this->permissions->keyNested($key, !$this->permissions->keyNested($key));
            $this->save();
        })->setBodyValidators([
            'entity'        => 'required',
            'crudOperation' => 'in:crudCreate:crudRead:crudUpdate:crudDelete'
        ]);

        /**
         * @api.name                Toggle custom API method availability on an entity
         * @api.description         Toggles custom api method availability on given entity in loaded permission
         * @api.body.entity         Entity class
         * @api.body.api            API method's URL
         * @api.body.method         API method's method (can be post, get, delete, patch)
         */
        $this->api('PATCH', '/{id}/entity/toggle/api', function () {
            $data = $this->wRequest()->getRequestData();
            $key = 'entities.' . $data['entity'] . '.' . $data['url'] . '.' . $data['method'];
            $this->permissions->keyNested($key, !$this->permissions->keyNested($key));
            $this->save();
        })->setBodyValidators([
            'entity' => 'required',
            'url'    => 'required',
            'method' => 'in:post:get:patch:delete'
        ]);

        /**
         * @api.name                Toggle custom API method availability in a service
         * @api.description         Toggles custom api method availability on given service in loaded permission
         * @api.body.service        Service class
         * @api.body.api            API method's URL
         * @api.body.method         API method's method (can be post, get, delete, patch)
         */
        $this->api('PATCH', '/{id}/service/toggle/api', function () {
            $data = $this->wRequest()->getRequestData();
            $key = 'services.' . $data['service'] . '.' . $data['url'] . '.' . $data['method'];
            $this->permissions->keyNested($key, !$this->permissions->keyNested($key));
            $this->save();
        })->setBodyValidators([
            'service' => 'required',
            'url'     => 'required',
            'method'  => 'in:post:get:patch:delete'
        ]);
    }


    public function checkPermission($item, $permission)
    {
        $class = $this->str($item)->explode('\\')->filter()->values()->val();

        // We ony handle the common namespace structure. Everything else will be ignored and returned as false
        if ($class[3] != 'Entities' && $class[3] != 'Services') {
            return false;
        }

        $key = strtolower($class[3]) . '.' . $item;

        if (!$this->permissions->keyExistsNested($key)) {
            return false;
        }

        return $this->permissions->keyNested($key . '.' . $permission);
    }
}