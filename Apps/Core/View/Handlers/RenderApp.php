<?php
namespace Apps\Core\View\Handlers;

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
    use StdLibTrait, PlatformTrait, TemplateEngineTrait;

    public function handle(Event $event)
    {
        if ($this->getPlatform()->getEnvironment()->isDevelopment()) {
            // Get a list of components that need to be built
            $components = [];
            /* @var $app App */
            $storage = new Storage(new Local($this->getPlatform()->getAppsPath()));
            foreach ($this->getPlatform()->getApps() as $app) {
                /* @var $module Module */
                foreach ($app->getModules() as $module) {
                    $moduleComponentsPath = $app->getName() . '/' . $module->getName() . '/Js/Components';
                    $componentsDir = new LocalDirectory($moduleComponentsPath, $storage);
                    /* @var $item LocalDirectory */
                    foreach ($componentsDir as $item) {
                        if ($item->isDirectory()) {
                            $componentPath = $storage->getAbsolutePath($item->getKey());
                            $componentName = $this->str($item->getKey())->explode('/')->last()->val();
                            if(!file_exists($componentPath . '/' . $componentName . '.js')){
                                continue;
                            }
                            $buildPath = $app->getName() . '/Build/Development/' . $module->getName() . '/' . $componentName;
                            $components[] = [
                                'name'     => $componentName,
                                'jsPath'   => $componentPath . '/' . $componentName . '.js',
                                'tplPath'  => $componentPath . '/' . $componentName . '.htpl',
                                'buildDir' => $storage->getAbsolutePath($buildPath)
                            ];
                        }
                    }
                }

                // Parse HTPL and build component in App/Build folder
                foreach ($components as $cmp) {
                    // Parse HTPL and store JSX
                    $parser = new Parser();
                    $jsx = $parser->parse(file_get_contents($cmp['tplPath']));
                    @mkdir($cmp['buildDir'], 0755, true);
                    $jsxPath = $cmp['buildDir'] . '/' . $cmp['name'] . '.js';
                    file_put_contents($jsxPath, $jsx);

                    // Transform JSX to React
                    exec('jsx ' . $cmp['buildDir'] . ' ' . $cmp['buildDir']);

                    // Optimize JSX
                    $jsx = file_get_contents($jsxPath);
                    $jsx = str_replace("\n", "", $jsx);
                    $jsx = preg_replace("/>\s+</", "><", $jsx);
                    $jsx = preg_replace("/>\s+{/", ">{", $jsx);
                    $jsx = preg_replace("/}\s+</", "}<", $jsx);
                    $jsx = preg_replace("/>\s+&/", ">&", $jsx);
                    $jsx = preg_replace("/;\s+</", ";<", $jsx);

                    // Build component
                    $js = file_get_contents($cmp['jsPath']);
                    $getFqnPos = strpos($js, 'getFqn()');
                    $partOne = substr($js, 0, $getFqnPos);
                    $partTwo = substr($js, $getFqnPos);

                    $getTemplateFn = "getTemplate(){ return '".$jsx. "';\n\t}\n\n\t";

                    $buildComponent = $partOne . $getTemplateFn . $partTwo;
                    file_put_contents($jsxPath, $buildComponent);
                }
            }
        }

        $bootstrapGenerator = new BackendBootstrap();
        $bootstrapGenerator->generateBootstrapFile();

        $html = $this->templateEngine()->fetch($this->getModule()->getTemplate('Master.tpl'));

        return new HtmlResponse($html);
    }
}