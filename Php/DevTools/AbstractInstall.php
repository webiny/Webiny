<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools;

use Apps\Core\Php\Entities\UserPermission;
use Apps\Core\Php\Entities\UserRole;
use Apps\Core\Php\PackageManager\App;
use Closure;
use MongoDB\Driver\Exception\RuntimeException;
use Webiny\Component\Entity\EntityException;

/**
 * Class AbstractInstall
 *
 * This class serves as a base for app installer
 */
abstract class AbstractInstall
{
    use WebinyTrait;

    /**
     * @var App
     */
    private $app = null;

    /**
     * Run the installation
     *
     * @param App $app Instance of PackageManager\App being run
     */
    abstract protected function run(App $app);

    final public function __invoke(App $app)
    {
        $this->app = $app;
        $this->installIndexes();
        $this->run($app);
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
                }
            }
        }
    }

    private function installIndexes()
    {
        foreach ($this->app->getEntities() as $e) {
            /* @var $entity \Apps\Core\Php\DevTools\Entity\AbstractEntity */
            $entity = new $e['class'];
            $collection = $entity->getEntityCollection();
            $indexes = $entity->getIndexes();

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
}
