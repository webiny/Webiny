<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\Lib\LifeCycle;

use Apps\Webiny\Php\Lib\Response\ApiErrorResponse;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Apps\Webiny\Php\Entities\UserPermission;
use Apps\Webiny\Php\Entities\UserRole;
use Apps\Webiny\Php\Lib\Apps\App;
use MongoDB\Driver\Exception\RuntimeException;
use Webiny\Component\Entity\EntityException;

/**
 * Class Install
 *
 * This class serves as a base for app installer
 */
class Install implements LifeCycleInterface
{
    use WebinyTrait;

    /**
     * Run the installation
     *
     * @param App $app Instance of Apps\App being run
     */
    public function run(App $app)
    {
        $this->installJsDependencies($app);
        $this->createUserPermissions();
        $this->createUserRoles();
        $this->createIndexes($app);
    }

    /**
     * Return an array of app permissions
     *
     * @return array
     */
    public function getUserPermissions()
    {
        return [];
    }

    /**
     * Return an array of app roles
     *
     * @return array
     */
    public function getUserRoles()
    {
        return [];
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
     * Scan app entities and create indexes if needed
     *
     * @param App $app
     */
    protected function createIndexes(App $app)
    {
        foreach ($app->getEntities() as $e) {
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
     * Install JS dependencies
     * Default: `yarn install` is executed in the root of the app to install both production and development dependencies
     *
     * @param App $app
     */
    protected function installJsDependencies($app)
    {
        if (file_exists($app->getPath() . '/package.json')) {
            passthru('cd ' . $app->getPath() . ' && yarn install');
        }
    }

    private function printException(EntityException $e)
    {
        $response = new ApiErrorResponse($e->getInvalidAttributes(), $e->getMessage(), $e->getCode());
        print_r($response->getData(true));
    }
}
