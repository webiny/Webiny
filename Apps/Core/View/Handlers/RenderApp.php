<?php
namespace Apps\Core\View\Handlers;

use Webiny\Component\Config\ConfigTrait;
use Webiny\Component\Storage\Directory\LocalDirectory;
use Webiny\Component\Storage\Driver\Local\Local;
use Webiny\Component\Storage\Storage;
use Webiny\Platform\Bootstrap\App;
use Webiny\Platform\Bootstrap\Generators\BackendBootstrap;
use Webiny\Platform\Bootstrap\Module;
use Webiny\Platform\Responses\HtmlResponse;
use Webiny\Platform\Traits\PlatformTrait;
use Webiny\Platform\Traits\TemplateEngineTrait;
use Webiny\Component\EventManager\Event;
use Webiny\Component\StdLib\StdLibTrait;

class RenderApp
{
    use StdLibTrait, PlatformTrait, TemplateEngineTrait, ConfigTrait;

    public function handle(Event $event)
    {
        if ($this->getPlatform()->getEnvironment()->isDevelopment()) {
            // Get a list of components that need to be built
            $components = [];
            /* @var $app App */
            $storage = new Storage(new Local($this->getPlatform()->getAppsPath()));
            foreach ($this->getPlatform()->getApps() as $app) {
                $appName = $app->getName();
                $buildLog = $this->_loadBuildLog($storage, $app);
                /* @var $module Module */
                foreach ($app->getModules() as $module) {
                    $moduleName = $module->getName();
                    $moduleComponentsPath = $app->getName() . '/' . $module->getName() . '/Js/Components';
                    $componentsDir = new LocalDirectory($moduleComponentsPath, $storage);
                    /* @var $item LocalDirectory */
                    foreach ($componentsDir as $item) {
                        if ($item->isDirectory()) {
                            $componentPath = $storage->getAbsolutePath($item->getKey());
                            $componentName = $this->str($item->getKey())->explode('/')->last()->val();
                            $componentJsKey = $item->getKey() . '/' . $componentName . '.js';
                            $componentHtplKey = $item->getKey() . '/' . $componentName . '.htpl';
                            if (!$storage->keyExists($componentJsKey)) {
                                continue;
                            }

                            // Check last modified timestamp against the build log
                            $lmLog = $buildLog->keyNested('LastModified.' . $moduleName . '.' . $componentName);
                            $lmJsDisk = $storage->getTimeModified($componentJsKey);
                            $lmHtplDisk = $storage->getTimeModified($componentHtplKey);
                            $lmComponent = $lmJsDisk + $lmHtplDisk;

                            if ($lmLog && $lmLog >= $lmComponent) {
                                continue;
                            }

                            $buildLog->keyNested('LastModified.' . $moduleName . '.' . $componentName, $lmComponent);
                            $components[] = [
                                'module'  => $moduleName,
                                'name'    => $componentName,
                                'jsPath'  => $componentPath . '/' . $componentName . '.js',
                                'tplPath' => $componentPath . '/' . $componentName . '.htpl'
                            ];
                        }
                    }
                }

                // Save new build log
                $storage->setContents($appName . '/Build/Log.json', $this->config()->php($buildLog)->getAsJson());

                // Parse HTPL and store component in App/BuildTmp folder
                $buildReactDir = $appName . '/BuildTmp/React';
                $buildJsxDir = $appName . '/BuildTmp/Jsx';
                @mkdir($buildReactDir, 0755, true);
                @mkdir($buildJsxDir, 0755, true);
                foreach ($components as $moduleName => $cmp) {
                    // Parse HTPL and store JSX
                    $parser = new Parser();
                    $jsx = $parser->parse(file_get_contents($cmp['tplPath']));

                    $jsxTmpPath = $buildJsxDir . '/' . $cmp['module'] . '_' . $cmp['name'] . '.js';
                    file_put_contents($jsxTmpPath, $jsx);
                }

                // Transform JSX to React
                exec('/home/webiny/local/bin/jsx ' . $buildJsxDir . ' ' . $buildReactDir);

                foreach ($components as $cmp) {
                    // Optimize JSX
                    $react = file_get_contents($buildReactDir . '/' . $cmp['module'] . '_' . $cmp['name'] . '.js');
                    $react = str_replace("\n", "", $react);
                    $replacements = [
                        "/>\s+</" => "><",
                        "/>\s+{/" => ">{",
                        "/}\s+</" => "}<",
                        "/>\s+&/" => ">&",
                        "/;\s+</" => ";<"
                    ];
                    $react = preg_replace(array_keys($replacements), array_values($replacements), $react);
                    $react = json_encode($react);


                    // Build component
                    $js = file_get_contents($cmp['jsPath']);
                    $getFqnPos = strpos($js, 'getFqn()');
                    $partOne = substr($js, 0, $getFqnPos);
                    $partTwo = substr($js, $getFqnPos);

                    $getTemplateFn = "getTemplate(){ return " . $react . ";}\n\n\t";

                    $buildComponent = $partOne . $getTemplateFn . $partTwo;
                    $componentKey = $appName . '/Build/Development/' . $cmp['module'] . '/' . $cmp['name'] . '/'. $cmp['name'] . '.js';
                    $storage->setContents($componentKey, $buildComponent);
                }
            }
        }

        $bootstrapGenerator = new BackendBootstrap();
        $bootstrapGenerator->generateBootstrapFile();

        $html = $this->templateEngine()->fetch($this->getModule()->getTemplate('Master.tpl'));

        return new HtmlResponse($html);
    }

    /**
     * @param Storage $storage
     * @param App     $app
     *
     * @return array|\Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject
     * @throws \Webiny\Component\Storage\StorageException
     */
    private function _loadBuildLog(Storage $storage, App $app)
    {
        $buildLog = $this->arr();

        $key = $app->getName() . '/Build/Log.json';
        if ($storage->keyExists($key)) {
            $buildLog = $this->config()->json($storage->getAbsolutePath($key))->toArray(true);
        }

        return $buildLog;
    }
}