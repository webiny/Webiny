<?php
$autoloader = require_once getcwd() . '/vendor/autoload.php';
$autoloader->addPsr4('Apps\\Core\\', getcwd() . '/Apps/Core');

class Release
{
    use \Webiny\Component\StdLib\StdLibTrait, \Apps\Core\Php\DevTools\DevToolsTrait;

    public function __construct($autoloader)
    {
        $this->autoloader = $autoloader;
        $this->absPath = getcwd() . '/';
    }

    public function run($domain)
    {
        $_SERVER = [];
        $_SERVER['SERVER_NAME'] = $domain;
        \Apps\Core\Php\Bootstrap\Bootstrap::getInstance();

        /* @var $app \Apps\Core\Php\PackageManager\App */
        foreach ($this->wApps() as $app) {
            foreach ($app->getEntities() as $e) {
                /* @var $entity \Apps\Core\Php\DevTools\Entity\AbstractEntity */
                $entity = new $e['class'];
                $collection = $entity->getEntityCollection();
                $indexes = $entity->getIndexes();

                $dbIndexes = $this->wDatabase()->listIndexes($entity->getEntityCollection());
                $installedIndexes = [];
                foreach ($dbIndexes as $ind) {
                    $installedIndexes[] = $ind['name'];
                }

                // Check if any indexes need to be created
                if (count($indexes)) {
                    /* @var $index \Webiny\Component\Mongo\Index\AbstractIndex */
                    foreach ($indexes as $index) {
                        $installed = in_array($index->getName(), $installedIndexes);
                        if (!$installed) {
                            echo "Creating '" . $index->getName() . "' index in '" . $collection . "' collection...\n";
                            try {
                                $this->wDatabase()->createIndex($collection, $index);
                            } catch (\MongoDB\Driver\Exception\RuntimeException $e) {
                                if ($e->getCode() === 85) {
                                    echo "WARNING: another index with same fields already exists. Skipping creation of '" . $index->getName() . "' index.\n";
                                }
                            }
                        }
                    }
                }

                // Check of any indexes need to be dropped
                foreach ($installedIndexes as $index) {
                    $removed = !array_key_exists($index, $indexes);
                    if ($removed && $index !== '_id_') {
                        echo "Dropping '" . $index . "' index from '" . $collection . "' collection...\n";
                        $this->wDatabase()->dropIndex($collection, $index);
                    }
                }
            }
        }
    }
}

$release = new Release($autoloader);
$release->run($argv[1]);

