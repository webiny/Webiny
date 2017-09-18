<?php

namespace Apps\Webiny\Php\Entities;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Apps\Parser\AbstractParser;
use Apps\Webiny\Php\Lib\Apps\Parser\EntityParser;
use Apps\Webiny\Php\Lib\Apps\Parser\ServiceParser;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Webiny\Component\Mongo\Index\CompoundIndex;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class UserPermission
 *
 * @property string      $name
 * @property string      $slug
 * @property ArrayObject $permissions
 */
class UserPermission extends AbstractEntity
{
    protected static $classId = 'Webiny.Entities.UserPermission';
    protected static $entityCollection = 'UserPermissions';
    protected static $entityMask = '{name}';

    public function __construct()
    {
        parent::__construct();

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
        $this->attr('roles')->many2many('UserRole2UserPermission')->setEntity(UserRole::class);
        $this->attr('permissions')->object()->onSet(function ($value) {
            if (!is_array($value)) {
                $value = [];
            }

            if (count($value) === 0) {
                return $value;
            }

            // Cleanup `false` values
            $clean = [];
            foreach ($value as $perm) {
                $on = 0;
                $cleanPerm = ['classId' => $perm['classId'], 'rules' => []];
                foreach ($perm['rules'] as $url => $rules) {
                    if (is_bool($rules)) {
                        if ($rules) {
                            $on++;
                            $cleanPerm['rules'][$url] = true;
                        }

                        continue;
                    }

                    foreach ($rules as $m => $v) {
                        if ($v) {
                            $on++;
                            $cleanPerm['rules'][$url][$m] = true;
                        }
                    }
                }

                if ($on > 0) {
                    $clean[] = $cleanPerm;
                }
            }

            return $clean;
        });
    }

    protected function entityApi(ApiContainer $api)
    {
        parent::entityApi($api);

        /**
         * @api.name                    List entity API methods
         * @api.description             Lists CRUD and custom entity methods from all available applications.
         * @api.query.exclude   array   Array of classIds that must be excluded from the response
         * @api.query.classIds  array   Array of classIds that must be included in the response
         * @api.query.classId    string  Single classId for which the information is needed
         */
        $api->get('/entity', function () {
            $query = $this->wRequest()->query();

            return $this->getResources($query, 'getEntities', EntityParser::class);
        });

        /**
         * @api.name                    List available services
         * @api.description             Lists service methods from all available applications.
         * @api.query.exclude   array   Array of classIds that must be excluded from the response
         * @api.query.classIds  array   Array of classIds that must be included in the response
         * @api.query.classId   string  Single classId for which the information is needed
         */
        $api->get('/service', function () {
            $query = $this->wRequest()->query();

            return $this->getResources($query, 'getServices', ServiceParser::class);
        });
    }

    protected static function entityIndexes(IndexContainer $indexes)
    {
        parent::entityIndexes($indexes);

        $indexes->add(new CompoundIndex('unique', ['slug', 'deletedOn'], false, true));
    }

    public function checkPermission($item, $permission)
    {
        foreach ($this->permissions as $p) {
            if ($p['classId'] == $item) {
                return $this->arr($p['rules'])->keyNested($permission) ?? false;
            }
        }

        return false;
    }

    private function getResources($data, $appMethod, $parserClass)
    {
        $exclude = $data['exclude'] ?? [];
        $multiple = $data['classIds'] ?? false;
        $single = false;

        if (!$multiple) {
            $single = $data['classId'] ?? false;
            if ($single) {
                $multiple = [$single];
            }
        }

        $resources = [];
        /* @var $app App */
        foreach ($this->wApps() as $app) {
            foreach ($app->$appMethod() as $resource) {
                if (in_array($resource['classId'], $exclude)) {
                    continue;
                }

                if ($multiple && !in_array($resource['classId'], $multiple)) {
                    continue;
                }

                /* @var $parser AbstractParser */
                $parser = new $parserClass($resource['class']);
                $resource['methods'] = $parser->getApiMethods();

                if ($resource['classId'] == $single) {
                    foreach ($resource['methods'] as &$method) {
                        $method['usages'] = $this->getMethodUsages($resource['classId'], $method);
                    }

                    return $resource;
                }

                $resources[] = $resource;
            }
        }

        // Additionally, we want to know who else is exposing particular method.
        foreach ($resources as &$resource) {
            foreach ($resource['methods'] as &$method) {
                $method['usages'] = $this->getMethodUsages($resource['classId'], $method);
            }
        }

        return $resources;
    }

    private function getMethodUsages($classId, $method, $checkCrud = false)
    {
        $crudMethod = $checkCrud ? $this->isCrudEntityMethod($method) : false;

        $key = 'rules.' . ($crudMethod ? $crudMethod : $method['key']);
        $query = [
            'permissions' => [
                '$elemMatch' => [
                    'classId' => $classId,
                    $key      => true
                ]
            ]
        ];

        $params = ['UserPermissions', $query, [], 0, 0, ['projection' => ['_id' => 0, 'id' => 1, 'name' => 1]]];
        $return = $this->wDatabase()->find(...$params);

        if (empty($return)) {
            return [];
        }

        $ids = [];
        foreach ($return as $permission) {
            $ids[$permission['id']] = $permission['name'];
        }

        $permissionsWithRoles = $this->wDatabase()->aggregate('UserRole2UserPermission', [
            ['$match' => ['UserPermission' => ['$in' => array_keys($ids)]]],
            [
                '$lookup' => [
                    'from'         => 'UserRoles',
                    'localField'   => 'UserRole',
                    'foreignField' => 'id',
                    'as'           => 'roles'
                ]
            ],
            [
                '$project' => ['_id' => 0, 'id' => '$UserPermission', 'roles.name' => 1, 'roles.id' => 1]
            ]
        ])->toArray();

        $rolesPerPermission = [];
        foreach ($permissionsWithRoles as $permissionWithRoles) {
            $id = $permissionWithRoles['id'];
            if (isset($rolesPerPermission[$id])) {
                $rolesPerPermission[$id] = array_merge($rolesPerPermission[$id], $permissionWithRoles['roles']);
            } else {
                $rolesPerPermission[$id] = $permissionWithRoles['roles'];
            }
        }

        foreach ($return as &$permission) {
            $permission['roles'] = [];
            if (isset($rolesPerPermission[$permission['id']])) {
                $permission['roles'] = $rolesPerPermission[$permission['id']];
            }
        }

        return $return;
    }

    private function isCrudEntityMethod($method)
    {
        $isCustom = $method['custom'] ?? false;
        if (!$isCustom) {
            switch ($method['key']) {
                case '/.get':
                case '{id}.get':
                    return 'r';
                case '/.post':
                    return 'c';
                case '/.delete':
                    return 'd';
                case '/.patch':
                    return 'u';
            }
        }

        return false;
    }

}