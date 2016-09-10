<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\DevTools;

use Apps\Core\Php\PackageManager\App;
use MongoDB\Driver\Exception\RuntimeException;

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
