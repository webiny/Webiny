<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\DevTools\LifeCycle;

use Apps\Webiny\Php\DevTools\Response\ApiErrorResponse;
use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\Entities\UserPermission;
use Apps\Webiny\Php\Entities\UserRole;
use Apps\Webiny\Php\PackageManager\App;
use Closure;
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
     * @param App $app Instance of PackageManager\App being run
     */
    public function run(App $app)
    {
        $this->installJsDependencies($app);
        $this->createIndexes($app);
    }

    /**
     * Create user permissions
     *
     * @param array        $permissions
     * @param null|Closure $exceptionHandler Takes an exception and permission being inserted as parameters
     */
    protected function createUserPermissions($permissions, Closure $exceptionHandler = null)
    {
        foreach ($permissions as $perm) {
            $p = new UserPermission();
            try {
                $p->populate($perm)->save();
            } catch (EntityException $e) {
                if (is_callable($exceptionHandler)) {
                    $exceptionHandler($e, $p);
                } else {
                    $invalidAttributes = $e->getInvalidAttributes();
                    if (array_key_exists('slug', $invalidAttributes)) {
                        $p = UserPermission::findOne(['slug' => $perm['slug']]);
                        if ($p) {
                            try {
                                $p->populate($perm)->save();
                            } catch (EntityException $e) {
                                echo("\n\nError occurred while updating UserPermission with the following data:\n\n");
                                print_r($p);
                                $this->printException($e);
                            }

                            continue;
                        }
                    }
                    echo("\n\nError occurred while installing UserPermission with the following data:\n\n");
                    print_r($perm);
                    $this->printException($e);
                }
            }
        }
    }

    /**
     * Create user roles
     *
     * @param array        $roles
     * @param null|Closure $exceptionHandler Takes an exception and role being inserted as parameters
     */
    protected function createUserRoles($roles, Closure $exceptionHandler = null)
    {
        foreach ($roles as $role) {
            $r = new UserRole();
            try {
                $r->populate($role)->save();
            } catch (EntityException $e) {
                if (is_callable($exceptionHandler)) {
                    $exceptionHandler($e, $r);
                } else {
                    $invalidAttributes = $e->getInvalidAttributes();
                    if (array_key_exists('slug', $invalidAttributes)) {
                        $r = UserRole::findOne(['slug' => $role['slug']]);
                        if ($r) {
                            try {
                                $r->populate($role)->save();
                            } catch (EntityException $e) {
                                echo("\n\nError occurred while updating UserRole with the following data:\n\n");
                                print_r($role);
                                $this->printException($e);
                            }

                            continue;
                        }
                    }
                    echo("\n\nError occurred while installing UserRole with the following data:\n\n");
                    print_r($role);
                    $this->printException($e);
                }
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
            /* @var $entity \Apps\Webiny\Php\DevTools\Entity\AbstractEntity */
            $entity = new $e['class'];
            $collection = $entity->getEntityCollection();
            $indexes = $entity->getIndexes();

            if($e['class'] === 'Apps\Webiny\Php\Entities\User') {
                die(print_r($indexes));
            }

            /* @var $index \Webiny\Component\Mongo\Index\AbstractIndex */
            foreach ($indexes as $index) {
                try {
                    $this->wDatabase()->createIndex($collection, $index);
                } catch (RuntimeException $e) {
                    if ($e->getCode() === 85) {
                        echo "WARNING: another index with same fields already exists. Skipping creation of '" . $index->getName() . "' index.\n";
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
            exec('cd ' . $app->getPath() . ' && yarn install');
        }
    }

    private function printException(EntityException $e)
    {
        $response = new ApiErrorResponse($e->getInvalidAttributes(), $e->getMessage(), $e->getCode());
        print_r($response->getData(true));
    }
}
