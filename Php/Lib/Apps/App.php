<?php

namespace Apps\Webiny\Php\Lib\Apps;

use Apps\Webiny\Php\Entities\UserPermission;
use Apps\Webiny\Php\Entities\UserRole;
use Apps\Webiny\Php\Entities\UserRoleGroup;
use Apps\Webiny\Php\Lib\Response\ApiErrorResponse;
use Apps\Webiny\Php\Lib\Response\HtmlResponse;
use Closure;
use MongoDB\Driver\Exception\BulkWriteException;
use MongoDB\Driver\Exception\RuntimeException;
use Webiny\Component\Entity\EntityException;

/**
 * Class that holds information about an application.
 */
class App extends AbstractApp
{
    public function bootstrap()
    {
        // Override to implement
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
        $this->manageIndexes();
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
     * Scan app entities and create/drop indexes as needed
     */
    protected function manageIndexes()
    {
        foreach ($this->getEntities() as $e) {
            /* @var $entity \Apps\Webiny\Php\Lib\Entity\AbstractEntity */
            $entity = new $e['class'];
            $collection = $entity->getEntityCollection();
            $indexes = $entity->getIndexes();

            $dbIndexes = $this->wDatabase()->listIndexes($entity->getEntityCollection());
            $installedIndexes = [];
            foreach ($dbIndexes as $ind) {
                $installedIndexes[] = $ind['name'];
            }

            // Check if any indexes need to be created
            /* @var $index \Webiny\Component\Mongo\Index\AbstractIndex */
            foreach ($indexes as $index) {
                $installed = in_array($index->getName(), $installedIndexes);
                if (!$installed) {
                    echo "Creating '" . $index->getName() . "' index in '" . $collection . "' collection...\n";
                    try {
                        $this->wDatabase()->createIndex($collection, $index);
                    } catch (RuntimeException $e) {
                        if ($e->getCode() === 85) {
                            echo "WARNING: another index with same fields already exists. Skipping creation of '" . $index->getName() . "' index.\n";
                        } else {
                            echo $e->getMessage() . "\n";
                        }
                    }
                }
            }

            // Check of any indexes need to be dropped
            foreach ($installedIndexes as $index) {
                $removed = !$indexes->exists($index);
                if ($removed && $index !== '_id_') {
                    echo "Dropping '" . $index . "' index from '" . $collection . "' collection...\n";
                    $this->wDatabase()->dropIndex($collection, $index);
                }
            }
        }
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
        foreach ($this->getUserPermissions() as $perm) {
            $p = new UserPermission();
            try {
                $p->populate($perm)->save();
            } catch (BulkWriteException $e) {
                $this->printException($e->getMessage());
            } catch (EntityException $e) {
                $invalidAttributes = $e->getInvalidAttributes();
                if (array_key_exists('slug', $invalidAttributes)) {
                    $p = UserPermission::findOne(['slug' => $perm['slug']]);
                    if ($p) {
                        try {
                            $p->populate($perm)->save();
                        } catch (EntityException $e) {
                            $this->printException($e);
                        }

                        continue;
                    }
                }
                $this->printException($e);
            }
        }
    }

    /**
     * Create user roles
     */
    protected function createUserRoles()
    {
        foreach ($this->getUserRoles() as $role) {
            $r = new UserRole();
            try {
                $r->populate($role)->save();
            } catch (BulkWriteException $e) {
                $this->printException($e->getMessage());
            } catch (EntityException $e) {
                $invalidAttributes = $e->getInvalidAttributes();
                if (array_key_exists('slug', $invalidAttributes)) {
                    $r = UserRole::findOne(['slug' => $role['slug']]);
                    if ($r) {
                        try {
                            $r->populate($role)->save();
                        } catch (EntityException $e) {
                            $this->printException($e);
                        }

                        continue;
                    }
                }
                $this->printException($e);
            }
        }
    }

    /**
     * Create user role groups
     */
    protected function createUserRoleGroups()
    {
        foreach ($this->getUserRoleGroups() as $roleGroup) {
            $r = new UserRoleGroup();
            try {
                $r->populate($roleGroup)->save();
            } catch (BulkWriteException $e) {
                $this->printException($e->getMessage());
            } catch (EntityException $e) {
                $invalidAttributes = $e->getInvalidAttributes();
                if (array_key_exists('slug', $invalidAttributes)) {
                    $r = UserRoleGroup::findOne(['slug' => $roleGroup['slug']]);
                    if ($r) {
                        try {
                            $r->populate($roleGroup)->save();
                        } catch (EntityException $e) {
                            $this->printException($e);
                        }

                        continue;
                    }
                }
                $this->printException($e);
            }
        }
    }

    /**
     * Scan app entities and create indexes if needed
     */
    protected function createIndexes()
    {
        foreach ($this->getEntities() as $e) {
            /* @var $entity \Apps\Webiny\Php\Lib\Entity\AbstractEntity */
            $entity = new $e['class'];
            $collection = $entity->getEntityCollection();
            $indexes = $entity->getIndexes();

            /* @var $index \Webiny\Component\Mongo\Index\AbstractIndex */
            foreach ($indexes as $index) {
                try {
                    $this->wDatabase()->createIndex($collection, $index);
                } catch (RuntimeException $e) {
                    if ($e->getCode() === 85) {
                        echo "WARNING: Skipping creation of '" . $index->getName() . "' index (index with the same fields already exist).\n";
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
        $data = $dataSource;
        if (is_callable($dataSource)) {
            $data = $dataSource();
        }
        $html = $this->wTemplateEngine()->fetch($template, $data);

        return new HtmlResponse($html);
    }

    /**
     * Print exception in form of ApiErrorResponse.
     * This is printing directly because it is always run as a CLI script
     *
     * @param $e
     */
    private function printException($e)
    {
        $message = $e instanceof \Exception ? $e->getMessage() : $e;
        if ($e instanceof EntityException) {
            $response = new ApiErrorResponse($e->getInvalidAttributes(), $e->getMessage(), $e->getCode());
            $message = $response->getData(true);
        }

        print_r($message);
    }
}