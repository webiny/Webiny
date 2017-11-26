<?php

namespace Apps\Webiny\Php\Lib\Apps;

use Apps\Webiny\Php\Entities\UserPermission;
use Apps\Webiny\Php\Entities\UserRole;
use Apps\Webiny\Php\Entities\UserRoleGroup;
use Apps\Webiny\Php\Lib\Entity\Attributes\Many2ManyAttribute;
use Apps\Webiny\Php\Lib\Response\HtmlResponse;
use Closure;
use MongoDB\Driver\Exception\RuntimeException;
use Webiny\Component\Entity\EntityException;
use Webiny\Component\Mongo\Index\CompoundIndex;

/**
 * Class that holds information about an application.
 */
class App extends AbstractApp
{
    public function bootstrap()
    {
        $vendorAutoload = $this->getPath(true) . '/vendor/autoload.php';
        if (file_exists($vendorAutoload)) {
            require_once $vendorAutoload;
        }
    }

    public function install()
    {
        $this->createUserPermissions();
        $this->createUserRoles();
        $this->createUserRoleGroups();
        $this->createIndexes();
    }

    public function release()
    {
        $this->createUserPermissions();
        $this->createUserRoles();
        $this->createUserRoleGroups();
        $this->installJsDependencies();
    }

    public function getUserRoles()
    {
        $roles = [];
        $rolesFile = $this->getPath() . '/Php/Install/UserRoles.json';
        if (file_exists($rolesFile)) {
            $roles = json_decode(file_get_contents($rolesFile), true);
        }

        return $roles;
    }

    public function getUserRoleGroups()
    {
        $roleGroups = [];
        $roleGroupsFile = $this->getPath() . '/Php/Install/UserRoleGroups.json';
        if (file_exists($roleGroupsFile)) {
            $roleGroups = json_decode(file_get_contents($roleGroupsFile), true);
        }

        return $roleGroups;
    }

    public function getUserPermissions()
    {
        $permissions = [];
        $permissionsFile = $this->getPath() . '/Php/Install/UserPermissions.json';
        if (file_exists($permissionsFile)) {
            $permissions = json_decode(file_get_contents($permissionsFile), true);
        }

        return $permissions;
    }

    /**
     * Get array of app notification classes
     *
     * @return array
     */
    public function getAppNotificationTypes()
    {
        return [];
    }

    /**
     * Install production JS dependencies
     * Default: `yarn install --production` is executed in the root of the app
     * TODO: move this to Deploy CLI plugin
     */
    protected function installJsDependencies()
    {
        if (file_exists($this->getPath() . '/package.json')) {
            exec('cd ' . $this->getPath() . ' && yarn install --production');
        }
    }

    /**
     * Add an app route and a template that will be rendered for that route.<br/>
     *
     * @param string|\Closure $regex
     * @param string          $template
     * @param int             $priority
     * @param array|callable  $dataSource
     */
    protected function addAppRoute($regex, $template, $priority = 400, $dataSource = [])
    {
        $this->wEvents()->listen('Webiny.Bootstrap.Request', function () use ($regex, $template, $dataSource) {
            $path = $this->wRequest()->getCurrentUrl(true)->getPath(true);

            if (is_callable($regex) && !$regex($path)) {
                return null;
            }

            if (is_string($regex) && !$path->match($regex)) {
                return null;
            }

            return $this->renderApp($template, $dataSource);
        }, $priority);
    }

    /**
     * Create user permissions
     */
    protected function createUserPermissions()
    {
        foreach ($this->getUserPermissions() as $data) {
            $p = new UserPermission();
            try {
                $p->populate($data)->save();
            } catch (\Exception $e) {
                $message = $e->getMessage();
                if ($e instanceof EntityException && $e->getCode() === EntityException::VALIDATION_FAILED) {
                    $message = 'Record already exists. You can only update existing records manually.';
                }

                echo "SKIPPING PERMISSION: '{$data['name']}' ({$data['slug']})\n{$message}\n\n";
            }
        }
    }

    /**
     * Create user roles
     */
    protected function createUserRoles()
    {
        foreach ($this->getUserRoles() as $data) {
            $r = new UserRole();
            try {
                $r->populate($data)->save();
            } catch (\Exception $e) {
                $message = $e->getMessage();
                if ($e instanceof EntityException && $e->getCode() === EntityException::VALIDATION_FAILED) {
                    $message = 'Record already exists. You can only update existing records manually.';
                }

                echo "SKIPPING ROLE: '{$data['name']}' ({$data['slug']})\n{$message}\n\n";
            }
        }
    }

    /**
     * Create user role groups
     */
    protected function createUserRoleGroups()
    {
        foreach ($this->getUserRoleGroups() as $data) {
            $r = new UserRoleGroup();
            try {
                $r->populate($data)->save();
            } catch (\Exception $e) {
                $message = $e->getMessage();
                if ($e instanceof EntityException && $e->getCode() === EntityException::VALIDATION_FAILED) {
                    $message = 'Record already exists. You can only update existing records manually.';
                }

                echo "SKIPPING ROLE GROUP: '{$data['name']}' ({$data['slug']})\n{$message}\n\n";
            }
        }
    }

    /**
     * Scan app entities and create indexes if needed
     */
    protected function createIndexes()
    {
        $many2ManyUnique = [];

        foreach ($this->getEntities() as $e) {
            /* @var $entity \Apps\Webiny\Php\Lib\Entity\AbstractEntity */
            $entity = new $e['class'];
            $collection = $entity->getCollection();
            $indexes = $entity->getIndexes();

            /* @var $index \Webiny\Component\Mongo\Index\AbstractIndex */
            foreach ($indexes as $index) {
                try {
                    $this->wDatabase()->createIndex($collection, $index, ['background' => true]);
                } catch (RuntimeException $e) {
                    if ($e->getCode() === 85) {
                        echo "SKIPPING INDEX: '{$index->getName()}' in collection '{$collection}'\n{$e->getMessage()}\n\n";
                    }
                }
            }

            // Check if many2many attributes exist and create indexes for them automatically
            foreach ($entity->getAttributes() as $attr) {
                if ($attr instanceof Many2ManyAttribute) {
                    $aCollection = $attr->getIntermediateCollection();

                    // Many2Many attributes are specific in that the referenced entity will attempt to create this same index
                    // We store current collection name further in code, to skip creation of the same index again
                    if (in_array($aCollection, $many2ManyUnique)) {
                        continue;
                    }

                    $aField1 = $attr->getThisField();
                    $aField2 = $attr->getRefField();
                    $fields = [$aField1, $aField2, 'deletedOn'];
                    $index = new CompoundIndex('unique', $fields, false, true);
                    try {
                        $this->wDatabase()->createIndex($aCollection, $index, ['background' => true]);
                        $many2ManyUnique[] = $aCollection;
                    } catch (\Exception $e) {
                        echo "SKIPPING INDEX: '{$index->getName()}' in collection '{$aCollection}'\n{$e->getMessage()}\n\n";
                    }
                }
            }
        }
    }

    /**
     * Renders template and returns HTML response
     *
     * @param string        $template
     * @param array|Closure $dataSource
     *
     * @return HtmlResponse
     */
    private function renderApp($template, $dataSource)
    {
        if (!$this->wIsProduction() && !$this->wCli()->isDeveloping()) {
            $html = $this->wTemplateEngine()
                         ->fetch('Webiny:Templates/NotDeveloping.tpl', $this->wCli()->getConfig()->get('cli')->toArray());

            return new HtmlResponse($html);
        }

        $data = $dataSource;
        if (is_callable($dataSource)) {
            $data = $dataSource();
        }
        $html = $this->wTemplateEngine()->fetch($template, $data);

        return new HtmlResponse($html);
    }
}